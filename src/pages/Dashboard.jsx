import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ArrowUpRight } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dummy data
const candidateStatusData = [
  { status: "Pending", count: 12 },
  { status: "Interviewed", count: 8 },
  { status: "Hired", count: 5 },
  { status: "Rejected", count: 3 },
];

const jobData = {
  totalJobs: 10,
  archived: 3,
  unarchived: 7,
};

export default function Dashboard() {
  const totalCandidates = candidateStatusData.reduce(
    (acc, item) => acc + item.count,
    0
  );

  const barData = {
    labels: candidateStatusData.map((item) => item.status),
    datasets: [
      {
        label: "Candidates",
        data: candidateStatusData.map((item) => item.count),
        backgroundColor: "#4F46E5",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Candidate Status Overview" },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to TalentFlow Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        <div className="bg-white shadow rounded p-8 bg-gradient-to-r from-yellow-100 to-yellow-50 p-8 text-black">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Total Candidates</h2>
            <span className=" bg-yellow-200 rounded-full p-3">
              <ArrowUpRight/>
            </span>
          </div>
          <p className="text-2xl font-bold">{totalCandidates}</p>
        </div>

        {candidateStatusData.map((item) => (
          <div key={item.status} className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">{item.status}</h2>
            <p className="text-2xl font-bold">{item.count}</p>
          </div>
        ))}

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Total Jobs</h2>
          <p className="text-2xl font-bold">{jobData.totalJobs}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Archived Jobs</h2>
          <p className="text-2xl font-bold">{jobData.archived}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Unarchived Jobs</h2>
          <p className="text-2xl font-bold">{jobData.unarchived}</p>
        </div>
      </div>

      {/* Chart.js Graph */}
      <div className="bg-white shadow rounded p-4">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
}
