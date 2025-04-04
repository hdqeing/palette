import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const SellerStats = () => {
// Data for Bar Chart (Monthly Sales)
const data1 = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales (€)",
        data: [5000, 7000, 3000, 9000, 6000],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };
  
  // Options for Bar Chart
  const options1 = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Sales" },
    },
  };
  
  // Data for Pie Chart (Sales Distribution)
  const data2 = {
    labels: ["Europalette", "Chemiepalette"],
    datasets: [
      {
        data: [50, 50], // 50% each
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };
  
  // Options for Pie Chart
  const options2 = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Sales Distribution" },
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px" }}>
    <div style={{ width: "50%" }}>
      <Bar data={data1} options={options1} />
    </div>
    <div style={{ width: "30%" }}>
      <Pie data={data2} options={options2} />
    </div>
  </div>
  );
};

export default SellerStats;
