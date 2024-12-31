import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary elements for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const GenderChart = () => {
  const [genderData, setGenderData] = useState({ Male: 0, Female: 0 });

  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const response = await fetch("/api/resident/getGenderCounts");
        const data = await response.json();

        const formattedData = data.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {});

        setGenderData(formattedData);
      } catch (error) {
        console.error("Error fetching gender data:", error);
      }
    };

    fetchGenderData();
  }, []);

  const chartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [genderData.Male || 0, genderData.Female || 0],
        backgroundColor: ["#42A5F5", "#FF6384"], // Colors for Male and Female
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Gender Distribution",
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default GenderChart;
