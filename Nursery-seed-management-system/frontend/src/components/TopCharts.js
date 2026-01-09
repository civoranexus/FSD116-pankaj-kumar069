import React, { useEffect, useState } from "react";
import API from "../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TopCharts({ start, end, supplierId, productId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });

      try {
        const query = new URLSearchParams({ start, end, supplierId, productId }).toString();
        const res = await API.get(`/sales/report?${query}`);
        setReport(res.data);

        if ((!res.data.topProducts || res.data.topProducts.length === 0) &&
            (!res.data.topSuppliers || res.data.topSuppliers.length === 0)) {
          setMessage({ type: "info", text: "No sales data available for selected filters." });
        }
      } catch (error) {
        console.error("Error fetching sales report:", error);
        setReport(null);
        setMessage({ type: "error", text: "Failed to load sales breakdown." });
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [start, end, supplierId, productId]);

  if (loading) return <p>Loading charts...</p>;
  if (message.text && !report) return <p style={{ color: message.type === "error" ? "red" : "gray" }}>{message.text}</p>;

  const productData = {
    labels: report?.topProducts?.map((p) => p.name) || [],
    datasets: [
      {
        label: "Quantity Sold",
        data: report?.topProducts?.map((p) => p.quantitySold) || [],
        backgroundColor: "rgba(255, 165, 0, 0.7)", // orange
      },
      {
        label: "Revenue (₹)",
        data: report?.topProducts?.map((p) => p.revenue) || [],
        backgroundColor: "rgba(41, 128, 185, 0.7)", // blue
      },
    ],
  };

  const supplierData = {
    labels: report?.topSuppliers?.map((s) => s.name) || [],
    datasets: [
      {
        label: "Quantity Sold",
        data: report?.topSuppliers?.map((s) => s.quantitySold) || [],
        backgroundColor: "rgba(155, 89, 182, 0.7)", // purple
      },
      {
        label: "Revenue (₹)",
        data: report?.topSuppliers?.map((s) => s.revenue) || [],
        backgroundColor: "rgba(39, 174, 96, 0.7)", // green
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Sales Breakdown",
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.formattedValue}`,
        },
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Top Products</h3>
      {report?.topProducts?.length > 0 ? (
        <Bar data={productData} options={options} />
      ) : (
        <p>No product sales found for this period.</p>
      )}

      <h3 style={{ marginTop: "2rem" }}>Top Suppliers</h3>
      {report?.topSuppliers?.length > 0 ? (
        <Bar data={supplierData} options={options} />
      ) : (
        <p>No supplier sales found for this period.</p>
      )}
    </div>
  );
}

export default TopCharts;