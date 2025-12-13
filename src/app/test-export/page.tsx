'use client';

import { useEffect, useState } from 'react';
import { getReports, exportReport } from '../../utils/api';

export default function TestExportPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const data = await getReports('summary');
        setReportData(data);
      } catch (error) {
        console.error('Failed to fetch report data:', error);
        setMessage('Failed to fetch report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!reportData) {
      setMessage('No report data available');
      return;
    }

    try {
      setLoading(true);
      const result = await exportReport(format, 'summary', reportData);
      if (result.success) {
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setMessage('Export failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Report Export</h1>
          
          {loading && (
            <div className="mb-4 p-4 bg-blue-50 rounded-md">
              <p className="text-blue-800">Loading...</p>
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-4 bg-green-50 rounded-md">
              <p className="text-green-800">{message}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <button
              onClick={() => handleExport('pdf')}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
            >
              Export as PDF
            </button>
            
            <button
              onClick={() => handleExport('excel')}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
            >
              Export as Excel
            </button>
          </div>
          
          {reportData && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Report Data Preview</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {JSON.stringify(reportData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
