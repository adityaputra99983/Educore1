'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Activity, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the diagram component to avoid SSR issues
const AttendanceStatusDiagram = dynamic(() => import('../reports/components/AttendanceStatusDiagram'), { ssr: false });

const TestDiagramPage = () => {
  const { settings } = useSettings();
  const [reportData, setReportData] = useState<any>(null);

  // Mock data for testing
  useEffect(() => {
    // Create mock data functions
    const createMockSummaryData = () => ({
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
    });

    // Set initial report data to summary
    setReportData(createMockSummaryData());
  }, []);

  const handleReportTypeChange = (type: string) => {
    const createMockSummaryData = () => ({
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
    });
    
    const createMockPerformanceData = () => ({
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
        mostLate: [
          { nis: '12345', name: 'Ahmad Rifai', class: 'XII-A', late: 5 },
          { nis: '12346', name: 'Budi Santoso', class: 'XII-B', late: 4 },
          { nis: '12347', name: 'Citra Dewi', class: 'XII-A', late: 3 }
        ],
        mostAbsent: [
          { nis: '12348', name: 'Dedi Kurniawan', class: 'XII-C', absent: 4 },
          { nis: '12349', name: 'Eka Putri', class: 'XII-B', absent: 3 },
          { nis: '12350', name: 'Fajar Pratama', class: 'XII-A', absent: 2 }
        ]
      }
    });

    if (type === 'summary') {
      setReportData(createMockSummaryData());
    } else if (type === 'performance') {
      setReportData(createMockPerformanceData());
    }
  };

  return (
    <div className={`min-h-screen p-6 ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Test Diagram Visualisasi
          </h1>
          <p className={`mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Halaman uji coba untuk diagram visualisasi laporan kehadiran dan performa
          </p>
        </div>

        {/* Report Type Selector */}
        <div className={`rounded-2xl p-6 mb-6 shadow-lg transition-all duration-300 ${
          settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleReportTypeChange('summary')}
              className={`px-6 py-2.5 rounded-xl font-medium ${
                reportData?.reportType === 'summary'
                  ? settings.theme === 'dark'
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white'
                  : settings.theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Laporan Ringkasan
            </button>
            <button
              onClick={() => handleReportTypeChange('performance')}
              className={`px-6 py-2.5 rounded-xl font-medium ${
                reportData?.reportType === 'performance'
                  ? settings.theme === 'dark'
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white'
                  : settings.theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Laporan Performa
            </button>
          </div>
        </div>

        {/* Diagram Visualization */}
        {reportData && (
          <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 ${
            settings.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <Activity className="inline mr-2 w-6 h-6 text-blue-500" />
                Diagram Status Kehadiran Siswa
              </h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Visualisasi Data</span>
              </div>
            </div>
            
            {/* Show diagram for both summary and performance reports */}
            {(reportData.reportType === 'summary' || reportData.reportType === 'performance') && reportData.attendanceStats && (
              <AttendanceStatusDiagram 
                attendanceStats={{
                  present: reportData.attendanceStats.present || 0,
                  late: reportData.attendanceStats.late || 0,
                  absent: reportData.attendanceStats.absent || 0,
                  permission: reportData.attendanceStats.permission || 0
                }}
                promotionStats={reportData.promotionStats}
                performanceData={reportData.performanceData}
              />
            )}
          </div>
        )}

        {/* Report Data Display */}
        {reportData && (
          <div className={`rounded-2xl p-6 mt-6 shadow-lg transition-all duration-300 ${
            settings.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-100'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Data Laporan
            </h3>
            <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDiagramPage;
