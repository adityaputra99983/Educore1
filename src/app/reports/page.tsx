'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { BarChart3, Download, CheckCircle, Clock, XCircle, Shield, ArrowRightLeft, UserCheck, TrendingUp, PieChart, BarChart, Activity, Trash2 } from 'lucide-react';
import { getReports, removeStudent, exportReport } from '@/utils/api';
import dynamic from 'next/dynamic';

// Dynamically import Chart components to avoid SSR issues
const Bar = dynamic(() => import('@/components/Charts').then((mod) => mod.Bar), {
  ssr: false,
});
const Pie = dynamic(() => import('@/components/Charts').then((mod) => mod.Pie), {
  ssr: false,
});

// Dynamically import the new diagram component to avoid SSR issues
const AttendanceStatusDiagram = dynamic(() => import('./components/AttendanceStatusDiagram'), { ssr: false });

const ReportsPage = () => {
  const { settings } = useSettings();
  const [reportType, setReportType] = useState('summary');
  const [period, setPeriod] = useState('daily');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: '', type: '' });
  const [showDiagram, setShowDiagram] = useState(true); // New state for diagram visibility

  // Generate report
  const generateReport = async () => {
    try {
      setLoading(true);
      const data = await getReports(reportType, { period });
      if (data.success) {
        setReportData(data);
      } else {
        showNotification('Failed to generate report: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      showNotification('Error generating report: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Export report
  const handleExport = async (format: string) => {
    try {
      if (!reportData) {
        showNotification('No report data to export', 'error');
        return;
      }

      try {
        const result = await exportReport(format, reportType, reportData);
        if (result.success) {
          showNotification(result.message, 'success');
        } else {
          showNotification(result.message || 'Error exporting report', 'error');
        }
      } catch (error: any) {
        console.error('Error exporting report:', error);
        showNotification('Error exporting report: ' + (error.message || 'Unknown error'), 'error');
      }
    } catch (error: any) {
      console.error('Error exporting report:', error);
      showNotification('Error exporting report: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  // Show notification
  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle delete student
  const handleDeleteStudent = async (studentId: number, studentName: string) => {
    // Confirm before deleting
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data siswa ${studentName}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      // Delete student through API
      const response = await removeStudent(studentId);

      if (response.success) {
        // Regenerate report after deletion
        await generateReport();

        // Show success notification
        showNotification(`Data siswa ${studentName} berhasil dihapus`, 'success');
      } else {
        showNotification('Gagal menghapus siswa: ' + response.error, 'error');
      }
    } catch (error: any) {
      console.error('Error deleting student:', error);
      showNotification('Terjadi kesalahan saat menghapus siswa: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  // Generate initial report on component mount
  useEffect(() => {
    generateReport();
  }, [reportType, period]);

  // Add event listener for attendance updates to refresh reports
  useEffect(() => {
    const handleAttendanceUpdate = (event: CustomEvent) => {
      // Regenerate report when attendance is updated
      generateReport();

      // Show notification about the update
      showNotification('Data kehadiran telah diperbarui', 'success');
    };

    const handleRefreshReports = () => {
      generateReport();
    };

    window.addEventListener('attendanceUpdated', handleAttendanceUpdate as EventListener);
    window.addEventListener('refreshReports', handleRefreshReports);

    // Generate initial report on component mount
    generateReport();

    // Clean up
    return () => {
      window.removeEventListener('attendanceUpdated', handleAttendanceUpdate as EventListener);
      window.removeEventListener('refreshReports', handleRefreshReports);
    };
  }, [reportType, period]);

  // Handle report type change
  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
  };

  // Handle period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value);
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!reportData) return null;

    // Bar chart data
    const barChartData = {
      labels: ['Hadir', 'Terlambat', 'Tidak Hadir', 'Izin/Sakit'],
      datasets: [
        {
          label: 'Jumlah Siswa',
          data: [
            reportData.attendanceStats?.present || 0,
            reportData.attendanceStats?.late || 0,
            reportData.attendanceStats?.absent || 0,
            reportData.attendanceStats?.permission || 0,
          ],
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(59, 130, 246, 0.7)',
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(59, 130, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // Pie chart data
    const pieChartData = {
      labels: ['Hadir', 'Terlambat', 'Tidak Hadir', 'Izin/Sakit'],
      datasets: [
        {
          data: [
            reportData.attendanceStats?.present || 0,
            reportData.attendanceStats?.late || 0,
            reportData.attendanceStats?.absent || 0,
            reportData.attendanceStats?.permission || 0,
          ],
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(59, 130, 246, 0.7)',
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(59, 130, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return { barChartData, pieChartData };
  };

  const chartData = prepareChartData();

  return (
    <div className={`min-h-screen p-6 ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Modern Design */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Laporan Kehadiran dan Kenaikan Kelas
              </h1>
              <p className={`mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Hasil absensi dan kenaikan kelas yang terhubung dengan API
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDiagram(!showDiagram)}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${showDiagram
                    ? settings.theme === 'dark'
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    : settings.theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
              >
                <Activity className="w-4 h-4" />
                {showDiagram ? 'Sembunyikan Diagram' : 'Tampilkan Diagram'}
              </button>
              <button
                onClick={generateReport}
                disabled={loading}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${loading
                    ? 'opacity-50 cursor-not-allowed'
                    : settings.theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-700 to-purple-800 text-white hover:from-blue-800 hover:to-purple-900'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Refresh Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section with Enhanced Design */}
        <div className={`rounded-2xl p-6 mb-6 shadow-lg transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Jenis Laporan
              </label>
              <select
                value={reportType}
                onChange={handleReportTypeChange}
                className={`w-full px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${settings.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border-gray-200 text-gray-900'
                  }`}
              >
                <option value="summary">Ringkasan Kehadiran</option>
                <option value="class">Laporan per Kelas</option>
                <option value="promotion">Laporan Kenaikan Kelas</option>
                <option value="detailed">Detail Laporan</option>
                <option value="performance">Statistik Performa</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Periode
              </label>
              <select
                value={period}
                onChange={handlePeriodChange}
                className={`w-full px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${settings.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border-gray-200 text-gray-900'
                  }`}
              >
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-end gap-3">
              <button
                onClick={generateReport}
                disabled={loading}
                className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 flex-1 ${loading
                    ? 'opacity-50 cursor-not-allowed'
                    : settings.theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-700 to-purple-800 text-white hover:from-blue-800 hover:to-purple-900'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Hasilkan Laporan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        {reportData && (
          <div className={`rounded-2xl p-6 mb-6 shadow-lg transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            }`}>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleExport('pdf')}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-transform hover:scale-105 ${settings.theme === 'dark'
                    ? 'bg-red-700 text-white hover:bg-red-800'
                    : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
              >
                <Download className="w-4 h-4" />
                Ekspor PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-transform hover:scale-105 ${settings.theme === 'dark'
                    ? 'bg-green-700 text-white hover:bg-green-800'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                <Download className="w-4 h-4" />
                Ekspor Excel
              </button>
            </div>
          </div>
        )}

        {/* Report Content */}
        {loading ? (
          <div className={`rounded-2xl p-12 shadow-lg transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            } text-center`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className={`text-xl font-bold mb-2 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Memproses Laporan...
            </h3>
            <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Mohon tunggu sebentar, sedang menghasilkan laporan
            </p>
          </div>
        ) : reportData ? (
          <div className="space-y-6">
            {/* Summary Cards with Enhanced Design */}
            {reportData.attendanceStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${settings.theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>
                        Hadir
                      </p>
                      <h3 className={`text-3xl font-bold mt-2 ${settings.theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {reportData.attendanceStats.present}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-full ${settings.theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{
                          width: `${reportData.attendanceStats.totalStudents ? (reportData.attendanceStats.present / reportData.attendanceStats.totalStudents) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reportData.attendanceStats.totalStudents ? ((reportData.attendanceStats.present / reportData.attendanceStats.totalStudents) * 100).toFixed(1) : 0}% dari total siswa
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${settings.theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>
                        Terlambat
                      </p>
                      <h3 className={`text-3xl font-bold mt-2 ${settings.theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                        {reportData.attendanceStats.late}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-full ${settings.theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
                      }`}>
                      <Clock className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{
                          width: `${reportData.attendanceStats.totalStudents ? (reportData.attendanceStats.late / reportData.attendanceStats.totalStudents) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reportData.attendanceStats.totalStudents ? ((reportData.attendanceStats.late / reportData.attendanceStats.totalStudents) * 100).toFixed(1) : 0}% dari total siswa
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${settings.theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>
                        Tidak Hadir
                      </p>
                      <h3 className={`text-3xl font-bold mt-2 ${settings.theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                        {reportData.attendanceStats.absent}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-full ${settings.theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                      }`}>
                      <XCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${reportData.attendanceStats.totalStudents ? (reportData.attendanceStats.absent / reportData.attendanceStats.totalStudents) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reportData.attendanceStats.totalStudents ? ((reportData.attendanceStats.absent / reportData.attendanceStats.totalStudents) * 100).toFixed(1) : 0}% dari total siswa
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${settings.theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>
                        Izin/Sakit
                      </p>
                      <h3 className={`text-3xl font-bold mt-2 ${settings.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        {reportData.attendanceStats.permission}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-full ${settings.theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                      }`}>
                      <Shield className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${reportData.attendanceStats.totalStudents ? (reportData.attendanceStats.permission / reportData.attendanceStats.totalStudents) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reportData.attendanceStats.totalStudents ? ((reportData.attendanceStats.permission / reportData.attendanceStats.totalStudents) * 100).toFixed(1) : 0}% dari total siswa
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Diagram Section - Always visible for summary and performance reports */}
            {(reportData.reportType === 'summary' || reportData.reportType === 'performance') && reportData.attendanceStats && (
              <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-100'
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
              </div>
            )}

            {/* Charts - Only shown when showDiagram is true and not for summary/performance reports */}
            {chartData && showDiagram && !(reportData.reportType === 'summary' || reportData.reportType === 'performance') && (
              <div className={`rounded-2xl p-6 ${settings.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-100'} shadow-lg`}>
                <h3 className={`text-lg font-bold mb-4 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Visualisasi Data
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`text-md font-semibold mb-3 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Statistik Kehadiran
                    </h4>
                    <div className="h-64">
                      <Bar
                        data={chartData.barChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              labels: {
                                color: settings.theme === 'dark' ? '#D1D5DB' : '#374151',
                              },
                            },
                          },
                          scales: {
                            x: {
                              ticks: {
                                color: settings.theme === 'dark' ? '#9CA3AF' : '#6B7280',
                              },
                              grid: {
                                color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                              },
                            },
                            y: {
                              ticks: {
                                color: settings.theme === 'dark' ? '#9CA3AF' : '#6B7280',
                              },
                              grid: {
                                color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-md font-semibold mb-3 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Distribusi Status
                    </h4>
                    <div className="h-64">
                      <Pie
                        data={chartData.pieChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'right',
                              labels: {
                                color: settings.theme === 'dark' ? '#D1D5DB' : '#374151',
                                padding: 15,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Data Tables */}
            {reportData.students && (
              <div className={`rounded-2xl shadow-lg transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-100'
                }`}>
                <div className="p-6">
                  <h3 className={`text-lg font-bold mb-4 flex items-center ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                    <BarChart className="mr-2 w-5 h-5 text-blue-500" />
                    Data Siswa
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <th className={`px-4 py-3 text-left text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            NIS
                          </th>
                          <th className={`px-4 py-3 text-left text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Nama
                          </th>
                          <th className={`px-4 py-3 text-left text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Kelas
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Hadir
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Terlambat
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Tidak Hadir
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Izin/Sakit
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Total Hari
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Tingkat Kehadiran
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Status Kenaikan
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${settings.theme === 'dark' ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {reportData.students.map((student: any) => (
                          <tr
                            key={student.id}
                            className={`hover:${settings.theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'} transition-colors`}
                          >
                            <td className={`px-4 py-3 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {student.nis}
                            </td>
                            <td className={`px-4 py-3 font-medium ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                              {student.name}
                            </td>
                            <td className={`px-4 py-3 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {student.class}
                            </td>
                            <td className="px-4 py-3 text-center">{student.present || 0}</td>
                            <td className="px-4 py-3 text-center">{student.late || 0}</td>
                            <td className="px-4 py-3 text-center">{student.absent || 0}</td>
                            <td className="px-4 py-3 text-center">{student.permission || 0}</td>
                            <td className="px-4 py-3 text-center">{student.totalAttendanceDays || 0}</td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${student.attendance >= 90
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : student.attendance >= 75
                                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                      : 'bg-red-100 text-red-700 border border-red-200'
                                  }`}
                              >
                                {student.attendance}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${student.promotionStatus === 'naik'
                                    ? settings.theme === 'dark'
                                      ? 'bg-green-900/30 text-green-400 border border-green-800'
                                      : 'bg-green-100 text-green-700'
                                    : student.promotionStatus === 'tinggal'
                                      ? settings.theme === 'dark'
                                        ? 'bg-red-900/30 text-red-400 border border-red-800'
                                        : 'bg-red-100 text-red-700'
                                      : student.promotionStatus === 'lulus'
                                        ? settings.theme === 'dark'
                                          ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
                                          : 'bg-blue-100 text-blue-700'
                                        : settings.theme === 'dark'
                                          ? 'bg-gray-700 text-gray-300 border border-gray-600'
                                          : 'bg-gray-200 text-gray-700'
                                  }`}
                              >
                                {student.promotionStatus === 'naik'
                                  ? 'Naik'
                                  : student.promotionStatus === 'tinggal'
                                    ? 'Tinggal'
                                    : student.promotionStatus === 'lulus'
                                      ? 'Lulus'
                                      : 'Belum Ditentukan'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteStudent(student.id, student.name)}
                                className={`p-2 rounded-full ${settings.theme === 'dark'
                                    ? 'text-red-400 hover:bg-red-900/50'
                                    : 'text-red-600 hover:bg-red-100'
                                  }`}
                                title={`Hapus ${student.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Class Reports */}
            {reportData.classReports && (
              <div className={`rounded-2xl shadow-lg transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-100'
                }`}>
                <div className="p-6">
                  <h3 className={`text-lg font-bold mb-4 flex items-center ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                    <PieChart className="mr-2 w-5 h-5 text-blue-500" />
                    Laporan per Kelas
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <th className={`px-4 py-3 text-left text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Kelas
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Jumlah Siswa
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Hadir
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Terlambat
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Tidak Hadir
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Izin/Sakit
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Total Hari
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Tingkat Kehadiran
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Naik Kelas
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Tinggal Kelas
                          </th>
                          <th className={`px-4 py-3 text-center text-sm font-semibold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Lulus
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${settings.theme === 'dark' ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {reportData.classReports.map((classReport: any) => (
                          <tr
                            key={classReport.class}
                            className={`hover:${settings.theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'} transition-colors`}
                          >
                            <td className={`px-4 py-3 font-medium ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                              {classReport.class}
                            </td>
                            <td className="px-4 py-3 text-center">{classReport.totalStudents}</td>
                            <td className="px-4 py-3 text-center">{classReport.totalPresent || 0}</td>
                            <td className="px-4 py-3 text-center">{classReport.totalLate || 0}</td>
                            <td className="px-4 py-3 text-center">{classReport.totalAbsent || 0}</td>
                            <td className="px-4 py-3 text-center">{classReport.totalPermission || 0}</td>
                            <td className="px-4 py-3 text-center">{classReport.totalAttendanceDays || 0}</td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${classReport.averageAttendance >= 90
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : classReport.averageAttendance >= 75
                                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                      : 'bg-red-100 text-red-700 border border-red-200'
                                  }`}
                              >
                                {classReport.averageAttendance}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">{classReport.promoted}</td>
                            <td className="px-4 py-3 text-center">{classReport.retained}</td>
                            <td className="px-4 py-3 text-center">{classReport.graduated}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Promotion Reports */}
            {reportData.promotionStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${settings.theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>
                        Naik Kelas
                      </p>
                      <h3 className={`text-3xl font-bold mt-2 ${settings.theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                        {reportData.promotionStats.promoted}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-full ${settings.theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                      }`}>
                      <ArrowRightLeft className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${reportData.promotionStats.total ? (reportData.promotionStats.promoted / reportData.promotionStats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reportData.promotionStats.total ? ((reportData.promotionStats.promoted / reportData.promotionStats.total) * 100).toFixed(1) : 0}% dari total siswa
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${settings.theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>
                        Tinggal Kelas
                      </p>
                      <h3 className={`text-3xl font-bold mt-2 ${settings.theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                        {reportData.promotionStats.retained}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-full ${settings.theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                      }`}>
                      <XCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${reportData.promotionStats.total ? (reportData.promotionStats.retained / reportData.promotionStats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reportData.promotionStats.total ? ((reportData.promotionStats.retained / reportData.promotionStats.total) * 100).toFixed(1) : 0}% dari total siswa
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${settings.theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>
                        Lulus
                      </p>
                      <h3 className={`text-3xl font-bold mt-2 ${settings.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        {reportData.promotionStats.graduated}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-full ${settings.theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                      }`}>
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${reportData.promotionStats.total ? (reportData.promotionStats.graduated / reportData.promotionStats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reportData.promotionStats.total ? ((reportData.promotionStats.graduated / reportData.promotionStats.total) * 100).toFixed(1) : 0}% dari total siswa
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${settings.theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>
                        Belum Ditentukan
                      </p>
                      <h3 className={`text-3xl font-bold mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {reportData.promotionStats.undecided}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-full ${settings.theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                      }`}>
                      <UserCheck className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-gray-500 h-2 rounded-full"
                        style={{
                          width: `${reportData.promotionStats.total ? (reportData.promotionStats.undecided / reportData.promotionStats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reportData.promotionStats.total ? ((reportData.promotionStats.undecided / reportData.promotionStats.total) * 100).toFixed(1) : 0}% dari total siswa
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`rounded-2xl p-12 shadow-lg transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            } text-center`}>
            <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${settings.theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-bold mb-2 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Belum Ada Laporan
            </h3>
            <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Silakan pilih jenis laporan dan periode, lalu klik tombol "Hasilkan Laporan"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;