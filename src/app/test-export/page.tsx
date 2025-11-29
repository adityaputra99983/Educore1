'use client';

import React, { useState } from 'react';
import { generatePDFReport } from '@/utils/pdfGenerator';
import { generateExcelReport } from '@/utils/excelGenerator';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

const TestExportPage = () => {
  const [reportType, setReportType] = useState('summary');
  
  // Report type options
  const reportTypes = [
    { value: 'summary', label: 'Ringkasan' },
    { value: 'detailed', label: 'Detail Siswa' },
    { value: 'class', label: 'Per Kelas' },
    { value: 'promotion', label: 'Kenaikan Kelas' }
  ];

  // Sample data for different report types
  const getReportData = () => {
    switch (reportType) {
      case 'summary':
        return {
          reportType: 'summary',
          attendanceStats: {
            totalStudents: 150,
            present: 142,
            late: 5,
            absent: 3,
            permission: 2,
            attendanceRate: 94.7
          },
          promotionStats: {
            promoted: 45,
            retained: 3,
            graduated: 25,
            undecided: 2
          }
        };
      case 'detailed':
        return {
          reportType: 'detailed',
          students: [
            { nis: '1001', name: 'Ahmad Rifai', class: 'XII-A', present: 85, late: 3, absent: 2, permission: 0, attendance: 92.5, promotionStatus: 'naik' },
            { nis: '1002', name: 'Budi Santoso', class: 'XII-B', present: 78, late: 5, absent: 7, permission: 0, attendance: 85.0, promotionStatus: 'tinggal' },
            { nis: '1003', name: 'Cinta Dewi', class: 'XII-A', present: 88, late: 2, absent: 0, permission: 0, attendance: 97.5, promotionStatus: 'naik' },
            { nis: '1004', name: 'Dedi Prasetyo', class: 'XII-C', present: 82, late: 4, absent: 4, permission: 0, attendance: 90.0, promotionStatus: 'naik' },
            { nis: '1005', name: 'Eka Putri', class: 'XII-B', present: 90, late: 1, absent: 0, permission: 0, attendance: 98.5, promotionStatus: 'naik' }
          ]
        };
      case 'class':
        return {
          reportType: 'class',
          classReports: [
            { class: 'X-A', totalStudents: 30, present: 28, late: 1, absent: 1, permission: 0, averageAttendance: 95.0, promoted: 10, retained: 0, graduated: 0 },
            { class: 'X-B', totalStudents: 32, present: 29, late: 2, absent: 1, permission: 0, averageAttendance: 95.5, promoted: 12, retained: 1, graduated: 0 },
            { class: 'XI-A', totalStudents: 28, present: 26, late: 1, absent: 1, permission: 0, averageAttendance: 93.0, promoted: 0, retained: 0, graduated: 8 },
            { class: 'XI-B', totalStudents: 30, present: 27, late: 2, absent: 1, permission: 0, averageAttendance: 93.5, promoted: 0, retained: 1, graduated: 9 },
            { class: 'XII-A', totalStudents: 30, present: 28, late: 1, absent: 1, permission: 0, averageAttendance: 95.0, promoted: 0, retained: 0, graduated: 10 }
          ]
        };
      case 'promotion':
        return {
          reportType: 'promotion',
          promotionStats: {
            promoted: 45,
            retained: 3,
            graduated: 25,
            undecided: 2
          },
          detailedStats: [
            { nis: '1001', name: 'Ahmad Rifai', class: 'XI-A', currentStatus: 'hadir', promotionStatus: 'naik', nextClass: 'XII-A', currentTime: '2024/2025', attendancePercentage: 92.5 },
            { nis: '1002', name: 'Budi Santoso', class: 'XI-B', currentStatus: 'hadir', promotionStatus: 'tinggal', nextClass: 'XI-B', currentTime: '2024/2025', attendancePercentage: 85.0 },
            { nis: '1003', name: 'Cinta Dewi', class: 'XI-A', currentStatus: 'hadir', promotionStatus: 'naik', nextClass: 'XII-A', currentTime: '2024/2025', attendancePercentage: 97.5 },
            { nis: '1004', name: 'Dedi Prasetyo', class: 'XI-C', currentStatus: 'hadir', promotionStatus: 'naik', nextClass: 'XII-C', currentTime: '2024/2025', attendancePercentage: 90.0 },
            { nis: '1005', name: 'Eka Putri', class: 'XI-B', currentStatus: 'hadir', promotionStatus: 'naik', nextClass: 'XII-B', currentTime: '2024/2025', attendancePercentage: 98.5 }
          ]
        };
      default:
        return {
          reportType: 'summary',
          attendanceStats: {
            totalStudents: 150,
            present: 142,
            late: 5,
            absent: 3,
            permission: 2,
            attendanceRate: 94.7
          },
          promotionStats: {
            promoted: 45,
            retained: 3,
            graduated: 25,
            undecided: 2
          }
        };
    }
  };

  const reportData = getReportData();

  // Prepare data for charts
  const attendanceChartData = reportData.attendanceStats ? [
    { name: 'Hadir', value: reportData.attendanceStats.present },
    { name: 'Terlambat', value: reportData.attendanceStats.late },
    { name: 'Tidak Hadir', value: reportData.attendanceStats.absent },
    { name: 'Izin/Sakit', value: reportData.attendanceStats.permission }
  ] : [];

  const promotionChartData = reportData.promotionStats ? [
    { name: 'Naik Kelas', value: reportData.promotionStats.promoted, color: '#10B981' },
    { name: 'Tinggal Kelas', value: reportData.promotionStats.retained, color: '#EF4444' },
    { name: 'Lulus', value: reportData.promotionStats.graduated, color: '#3B82F6' },
    { name: 'Belum Ditentukan', value: reportData.promotionStats.undecided, color: '#F59E0B' }
  ] : [];

  // Enhanced chart data for class reports
  const classAttendanceData = reportData.classReports ? 
    reportData.classReports.map(report => ({
      name: report.class,
      kehadiran: report.averageAttendance,
      hadir: report.present,
      terlambat: report.late,
      tidakHadir: report.absent
    })) : [];

  const classComparisonData = reportData.classReports ? 
    reportData.classReports.map(report => ({
      name: report.class,
      siswa: report.totalStudents,
      naik: report.promoted,
      tinggal: report.retained,
      lulus: report.graduated
    })) : [];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value } = props;
    
    // Check if required properties exist
    if (cx === undefined || cy === undefined || midAngle === undefined || 
        innerRadius === undefined || outerRadius === undefined || percent === undefined) {
      return null;
    }
    
    const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5;
    const x = (cx as number) + (radius * Math.cos(-(midAngle as number) * Math.PI / 180));
    const y = (cy as number) + (radius * Math.sin(-(midAngle as number) * Math.PI / 180));

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

  const handleTestPDF = async () => {
    try {
      const blob = await generatePDFReport(reportData, reportType);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `laporan-${reportType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleTestExcel = async () => {
    try {
      const blob = await generateExcelReport(reportData, reportType);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `laporan-${reportType}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('Excel generated successfully');
    } catch (error) {
      console.error('Error generating Excel:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Test Ekspor Laporan</h1>
        
        {/* Report Type Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Pilih Jenis Laporan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value)}
                className={`py-3 px-4 rounded-lg transition-all duration-200 ${
                  reportType === type.value
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Preview Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Pratinjau Laporan: {reportTypes.find(t => t.value === reportType)?.label}
          </h2>
          
          {/* Summary Report */}
          {reportType === 'summary' && (
            <div>
              {/* Attendance Stats Table */}
              {reportData.attendanceStats && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Statistik Kehadiran</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Total Siswa</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.attendanceStats.totalStudents}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Hadir</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.attendanceStats.present}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Terlambat</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.attendanceStats.late}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Tidak Hadir</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.attendanceStats.absent}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Izin/Sakit</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.attendanceStats.permission}</td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tingkat Kehadiran</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reportData.attendanceStats.attendanceRate}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Enhanced Attendance Charts */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart */}
                    <div className="h-80">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Distribusi Kehadiran Siswa</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={attendanceChartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="value" name="Jumlah Siswa" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Pie Chart */}
                    <div className="h-80">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Proporsi Kehadiran</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={attendanceChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent ?? 0 * 100).toFixed(0)}%`}
                            nameKey="name"
                          >
                            {attendanceChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Promotion Stats */}
              {reportData.promotionStats && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Statistik Kenaikan Kelas</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Naik Kelas</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.promotionStats.promoted}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Tinggal Kelas</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.promotionStats.retained}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Lulus</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.promotionStats.graduated}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Belum Ditentukan</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.promotionStats.undecided}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Enhanced Promotion Charts */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart with custom labels */}
                    <div className="h-80">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Distribusi Status Kenaikan Kelas</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={promotionChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent ?? 0 * 100).toFixed(0)}%`}
                            nameKey="name"
                          >
                            {promotionChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Radar Chart */}
                    <div className="h-80">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Perbandingan Status Kenaikan</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={promotionChartData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="name" />
                          <PolarRadiusAxis />
                          <Radar
                            name="Status"
                            dataKey="value"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                          />
                          <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Detailed Report */}
          {reportType === 'detailed' && reportData.students && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Detail Laporan Siswa</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hadir</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terlambat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tidak Hadir</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Izin/Sakit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kehadiran %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kenaikan</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.students.map((student, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.nis}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.class}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.present}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.late}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.absent}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.permission}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.promotionStatus === 'naik' ? 'bg-green-100 text-green-800' :
                            student.promotionStatus === 'tinggal' ? 'bg-red-100 text-red-800' :
                            student.promotionStatus === 'lulus' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.promotionStatus === 'naik' ? 'Naik' :
                             student.promotionStatus === 'tinggal' ? 'Tinggal' :
                             student.promotionStatus === 'lulus' ? 'Lulus' : 'Belum Ditentukan'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Student Performance Chart */}
              <div className="mt-8 h-80">
                <h4 className="text-md font-medium text-gray-700 mb-3">Grafik Kehadiran Siswa</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportData.students.map(student => ({
                      name: student.name,
                      kehadiran: student.attendance
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="kehadiran" name="Tingkat Kehadiran (%)" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {/* Class Report */}
          {reportType === 'class' && reportData.classReports && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Laporan per Kelas</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Siswa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hadir</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terlambat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tidak Hadir</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Izin/Sakit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kehadiran %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naik Kelas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tinggal Kelas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lulus</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.classReports.map((classReport, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{classReport.class}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{classReport.totalStudents}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{classReport.present}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{classReport.late}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{classReport.absent}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{classReport.permission}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {classReport.averageAttendance}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{classReport.promoted}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{classReport.retained}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{classReport.graduated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Enhanced Class Performance Charts */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Attendance Comparison */}
                  <div className="h-80">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Perbandingan Kehadiran per Kelas</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={classAttendanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="kehadiran" name="Rata-rata Kehadiran (%)" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Detailed Attendance Breakdown */}
                  <div className="h-80">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Rincian Kehadiran per Kelas</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={classAttendanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="hadir" name="Hadir" stackId="a" fill="#10B981" />
                        <Bar dataKey="terlambat" name="Terlambat" stackId="a" fill="#F59E0B" />
                        <Bar dataKey="tidakHadir" name="Tidak Hadir" stackId="a" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Class Promotion Comparison */}
                <div className="mt-8 h-80">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Perbandingan Status Kenaikan per Kelas</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={classComparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="siswa" name="Total Siswa" fill="#94A3B8" />
                      <Bar dataKey="naik" name="Naik Kelas" fill="#10B981" />
                      <Bar dataKey="tinggal" name="Tinggal Kelas" fill="#EF4444" />
                      <Bar dataKey="lulus" name="Lulus" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {/* Promotion Report */}
          {reportType === 'promotion' && (
            <div>
              {/* Promotion Stats Table */}
              {reportData.promotionStats && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Statistik Kenaikan Kelas</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Naik Kelas</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.promotionStats.promoted}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Tinggal Kelas</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.promotionStats.retained}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Lulus</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.promotionStats.graduated}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Belum Ditentukan</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reportData.promotionStats.undecided}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Enhanced Promotion Charts */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pie Chart */}
                    <div className="h-80">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Distribusi Status Kenaikan</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={promotionChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={renderCustomizedLabel}
                            nameKey="name"
                          >
                            {promotionChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Area Chart */}
                    <div className="h-80">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Tren Status Kenaikan</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={promotionChartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Line Chart */}
                    <div className="h-80">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Perbandingan Status</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={promotionChartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Detailed Stats */}
              {reportData.detailedStats && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Detail Statistik Siswa</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Saat Ini</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kenaikan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas Tujuan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kehadiran %</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.detailedStats.map((student, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{student.nis}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.class}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {student.currentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                student.promotionStatus === 'naik' ? 'bg-green-100 text-green-800' :
                                student.promotionStatus === 'tinggal' ? 'bg-red-100 text-red-800' :
                                student.promotionStatus === 'lulus' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {student.promotionStatus === 'naik' ? 'Naik' :
                                 student.promotionStatus === 'tinggal' ? 'Tinggal' :
                                 student.promotionStatus === 'lulus' ? 'Lulus' : 'Belum Ditentukan'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.nextClass}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.currentTime}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {student.attendancePercentage}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Student Promotion Chart */}
                  <div className="mt-8 h-80">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Grafik Status Kenaikan Siswa</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={reportData.detailedStats.map(student => ({
                          name: student.name,
                          kehadiran: student.attendancePercentage
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="kehadiran" name="Tingkat Kehadiran (%)" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Ekspor Laporan</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleTestPDF}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 16H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4v4h-6v-4zm2 0v3.586l4 4 4-4V16h-8z"/>
              </svg>
              Ekspor ke PDF
            </button>
            <button 
              onClick={handleTestExcel}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 12h4l-3 9L1 12h4V3H3v9zm18-9v18h-2v-9h-4v-2h4V3h2zm-3.5 7a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5zm0-2a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9z"/>
              </svg>
              Ekspor ke Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestExportPage;