<<<<<<< HEAD
'use client';

import dynamic from 'next/dynamic';

// Dynamically import Chart components to avoid SSR issues
const Bar = dynamic(() => import('@/components/Charts').then((mod) => mod.Bar), {
  ssr: false,
});
const Pie = dynamic(() => import('@/components/Charts').then((mod) => mod.Pie), {
  ssr: false,
});

export default function TestChartImport() {
  return (
    <div>
      <h1>Test Chart Import</h1>
      <p>If this page loads without errors, the chart imports are working correctly.</p>
    </div>
  );
=======
'use client';

import dynamic from 'next/dynamic';

// Dynamically import Chart components to avoid SSR issues
const Bar = dynamic(() => import('@/components/Charts').then((mod) => mod.Bar), {
  ssr: false,
});
const Pie = dynamic(() => import('@/components/Charts').then((mod) => mod.Pie), {
  ssr: false,
});

export default function TestChartImport() {
  return (
    <div>
      <h1>Test Chart Import</h1>
      <p>If this page loads without errors, the chart imports are working correctly.</p>
    </div>
  );
>>>>>>> 6e4a954937fec25b661d78aabe9237d139f19a73
}