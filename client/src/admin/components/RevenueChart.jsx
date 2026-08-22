import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

import "../css/RevenueChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = () => {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {

    fetchRevenue();

  }, []);

  const fetchRevenue = async () => {

    try {

      const token = localStorage.getItem("token");

      const { data } = await axios.get(

        "http://localhost:5000/api/admin/revenue-chart",

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      setChartData(data.chartData);

    }

    catch (error) {

      console.log(error);

    }

  };

  const data = {

    labels: chartData.map((item) => item.month),

    datasets: [

      {

        label: "Revenue",

        data: chartData.map((item) => item.revenue),

        borderColor: "#D4AF37",

        backgroundColor: "rgba(212,175,55,.20)",

        fill: true,

        tension: 0.4,

      },

    ],

  };

  const options = {

    responsive: true,

    plugins: {

      legend: {

        labels: {

          color: "#ffffff",

        },

      },

    },

    scales: {

      x: {

        ticks: {

          color: "#ffffff",

        },

        grid: {

          color: "#2d2d2d",

        },

      },

      y: {

        ticks: {

          color: "#ffffff",

        },

        grid: {

          color: "#2d2d2d",

        },

      },

    },

  };

  return (

    <div className="chart-container">

    <div className="chart-header">

      <div>

        <h2>Revenue Analytics</h2>

        <p>Monthly revenue generated from orders</p>

      </div>

    </div>

    <Line
      data={data}
      options={options}
    />

  </div>

  );

};

export default RevenueChart;