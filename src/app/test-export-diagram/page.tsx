'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Download, BarChart3 } from 'lucide-react';
import { generatePDFReport } from '@/utils/pdfGenerator';
import { generateExcelReport } from '@/utils/excelGenerator';

const TestExportDiagramPage = () => {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: '', type: '' });

  // Mock data for testing
  const mockSummaryData = {
    reportType: 'summary',
    attendanceStats: {
      totalStudents: 100,
      present: 85,
      late: 8,
      absent: 5,
      permission: 2,
      attendanceRate: 92.5
    },
    promotionStats: {
      promoted: 75,
      retained: 5,
      graduated: 15,
      undecided: 5,
      total: 100
    }
  };

  const mockPerformanceData = {
    reportType: 'performance',
    attendanceStats: {
      totalStudents: 100,
      present: 85,
      late: 8,
      absent: 5,
      permission: 2,
      attendanceRate: 92.5
    },
    performanceData: {
      perfectAttendance: 25,
      highAttendance: 50,
      mediumAttendance: 15,
      lowAttendance: 10,
      mostLate: []
      // Removed unused data as it's no longer needed
    }
  };

  // Show notification
  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Export PDF
  const handleExportPDF = async (reportType: string) => {
    try {
      setLoading(true);
      const data = reportType === 'summary' ? mockSummaryData : mockPerformanceData;
      const blob = await generatePDFReport(data, reportType);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `test-laporan-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(`PDF laporan ${reportType} berhasil diunduh!`, 'success');
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      showNotification('Error mengekspor PDF: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Export Excel
  const handleExportExcel = async (reportType: string) => {
    try {
      setLoading(true);
      const data = reportType === 'summary' ? mockSummaryData : mockPerformanceData;
      const blob = await generateExcelReport(data, reportType);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `test-laporan-${reportType}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(`Excel laporan ${reportType} berhasil diunduh!`, 'success');
    } catch (error: any) {
      console.error('Error exporting Excel:', error);
      showNotification('Error mengekspor Excel: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Test Ekspor dengan Diagram
          </h1>
          <p className={`mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Halaman uji coba untuk ekspor PDF dan Excel dengan diagram visualisasi
          </p>
        </div>

        {/* Export Buttons for Summary Report */}
        <div className={`rounded-2xl p-6 mb-6 shadow-lg transition-all duration-300 ${
          settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Ekspor Laporan Ringkasan
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExportPDF('summary')}
              disabled={loading}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : settings.theme === 'dark'
                    ? 'bg-red-700 text-white hover:bg-red-800'
                    : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <Download className="w-4 h-4" />
              Ekspor PDF Ringkasan
            </button>
            <button
              onClick={() => handleExportExcel('summary')}
              disabled={loading}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : settings.theme === 'dark'
                    ? 'bg-green-700 text-white hover:bg-green-800'
                    : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Download className="w-4 h-4" />
              Ekspor Excel Ringkasan
            </button>
          </div>
        </div>

        {/* Export Buttons for Performance Report */}
        <div className={`rounded-2xl p-6 mb-6 shadow-lg transition-all duration-300 ${
          settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Ekspor Laporan Performa
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExportPDF('performance')}
              disabled={loading}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : settings.theme === 'dark'
                    ? 'bg-red-700 text-white hover:bg-red-800'
                    : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <Download className="w-4 h-4" />
              Ekspor PDF Performa
            </button>
            <button
              onClick={() => handleExportExcel('performance')}
              disabled={loading}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : settings.theme === 'dark'
                    ? 'bg-green-700 text-white hover:bg-green-800'
                    : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Download className="w-4 h-4" />
              Ekspor Excel Performa
            </button>
          </div>
        </div>

        {/* Data Display */}
        <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 ${
          settings.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-100'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Data Laporan Ringkasan
          </h3>
          <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto mb-6">
            {JSON.stringify(mockSummaryData, null, 2)}
          </pre>
          
          <h3 className={`text-lg font-bold mb-4 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Data Laporan Performa
          </h3>
          <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto">
            {JSON.stringify(mockPerformanceData, null, 2)}
          </pre>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestExportDiagramPage;