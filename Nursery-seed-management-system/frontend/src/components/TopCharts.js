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
  Legend
} from "chart.js";



// Register the components you need
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

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const query = new URLSearchParams({ start, end, supplierId, productId }).toString();
        const res = await API.get(`/sales/report?${query}`);
        setReport(res.data);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };
    fetchReport();
  }, [start, end, supplierId, productId]);

  if (!report) return <p>Loading...</p>;

  const productData = {
    labels: report.topProducts.map(p => p.name),
    datasets: [
      {
        label: "Quantity Sold",
        data: report.topProducts.map(p => p.quantitySold),
        backgroundColor: "orange"
      },
      {
        label: "Revenue",
        data: report.topProducts.map(p => p.revenue),
        backgroundColor: "blue"
      }
    ]
  };

  const supplierData = {
    labels: report.topSuppliers.map(s => s.name),
    datasets: [
      {
        label: "Quantity Sold",
        data: report.topSuppliers.map(s => s.quantitySold),
        backgroundColor: "purple"
      },
      {
        label: "Revenue",
        data: report.topSuppliers.map(s => s.revenue),
        backgroundColor: "green"
      }
    ]
  };

  return (
    <div>
      <h3>Top Products</h3>
      <Bar data={productData} />
      <h3>Top Suppliers</h3>
      <Bar data={supplierData} />
    </div>
  );
}

export default TopCharts;