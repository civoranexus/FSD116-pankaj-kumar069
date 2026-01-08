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


function MonthlySalesChart({ year }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const res = await API.get(`/sales/report/monthly?year=${year}`);
        setData(res.data.monthlyData);
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };
    fetchMonthlySales();
  }, [year]);

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: "Revenue",
        data: data.map(d => d.totalRevenue),
        borderColor: "blue",
        fill: false
      },
      {
        label: "Orders",
        data: data.map(d => d.totalOrders),
        borderColor: "green",
        fill: false
      }
    ]
  };

  return (
    <div>
      <h3>Monthly Sales ({year})</h3>
      <Line data={chartData} />
    </div>
  );
}

export default MonthlySalesChart;