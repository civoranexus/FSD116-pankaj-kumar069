import React, { useEffect, useState } from "react";
import API from "../api";
import { Line } from "react-chartjs-2";
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

function MonthlySalesChart({ year }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchMonthlySales = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });

      try {
        const res = await API.get(`/sales/report/monthly?year=${year}`);
        setData(res.data.monthlyData || []);
        if (!res.data.monthlyData || res.data.monthlyData.length === 0) {
          setMessage({ type: "info", text: `No sales data available for ${year}.` });
        }
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
        setData([]);
        setMessage({ type: "error", text: "Failed to load monthly sales data." });
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlySales();
  }, [year]);

  if (loading) return <p>Loading monthly sales data...</p>;
  if (message.text && data.length === 0) return <p style={{ color: message.type === "error" ? "red" : "gray" }}>{message.text}</p>;

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Revenue (₹)",
        data: data.map((d) => d.totalRevenue),
        borderColor: "#2980b9",
        backgroundColor: "rgba(41, 128, 185, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Orders",
        data: data.map((d) => d.totalOrders),
        borderColor: "#27ae60",
        backgroundColor: "rgba(39, 174, 96, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Monthly Sales Report (${year})`,
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
      <h3>Monthly Sales ({year})</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default MonthlySalesChart;