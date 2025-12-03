'use client';

import dynamic from 'next/dynamic';

// Dynamically import Chart components to avoid SSR issues
const Bar = dynamic(() => import('@/components/Charts').then((mod) => mod.Bar), {
  ssr: false,
});
const Pie = dynamic(() => import('@/components/Charts').then((mod) => mod.Pie), {
  ssr: false,
});

// Sample data for the charts
const barData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

const pieData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function TestChartImport() {
  return (
    <div>
      <h1>Test Chart Import</h1>
      <p>If this page loads without errors, the chart imports are working correctly.</p>
      <Bar data={barData} />
      <Pie data={pieData} />
    </div>
  );
}