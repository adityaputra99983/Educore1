"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Import the components directly from the library
import { Bar as BarChart, Pie as PieChart } from "react-chartjs-2";

// Register chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Export the components with explicit names
export const Bar = BarChart;
export const Pie = PieChart;

