'use client';

import React from 'react';
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
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

interface AttendanceStatusDiagramProps {
  attendanceStats: {
    present: number;
    late: number;
    absent: number;
    permission: number;
  };
  promotionStats?: {
    promoted: number;
    retained: number;
    graduated: number;
    undecided: number;
  };
  performanceData?: {
    perfectAttendance: number;
    highAttendance: number;
    mediumAttendance: number;
    lowAttendance: number;
  };
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
const PROMOTION_COLORS = ['#10B981', '#EF4444', '#3B82F6', '#6B7280'];
const PERFORMANCE_COLORS = ['#10B981', '#84cc16', '#F59E0B', '#EF4444'];

// Define proper types for the tooltip props
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color?: string;
    name?: string;
    value?: number | string;
  }>;
  label?: string;
}

interface EntryProps {
  color?: string;
  name?: string;
  value?: number | string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry: EntryProps, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AttendanceStatusDiagram: React.FC<AttendanceStatusDiagramProps> = ({ 
  attendanceStats, 
  promotionStats,
  performanceData
}) => {
  // Prepare data for charts
  const attendanceData = [
    { name: 'Hadir', value: attendanceStats.present },
    { name: 'Terlambat', value: attendanceStats.late },
    { name: 'Tidak Hadir', value: attendanceStats.absent },
    { name: 'Izin/Sakit', value: attendanceStats.permission },
  ];

  const promotionData = promotionStats ? [
    { name: 'Naik Kelas', value: promotionStats.promoted },
    { name: 'Tinggal Kelas', value: promotionStats.retained },
    { name: 'Lulus', value: promotionStats.graduated },
    { name: 'Belum Ditentukan', value: promotionStats.undecided },
  ] : [];

  // Calculate total students for percentage calculations
  const totalStudents = attendanceStats.present + attendanceStats.late + 
                       attendanceStats.absent + attendanceStats.permission;

  // Prepare data for area chart showing attendance distribution
  const areaChartData = [
    { name: 'Hadir', percentage: totalStudents ? (attendanceStats.present / totalStudents) * 100 : 0 },
    { name: 'Terlambat', percentage: totalStudents ? (attendanceStats.late / totalStudents) * 100 : 0 },
    { name: 'Tidak Hadir', percentage: totalStudents ? (attendanceStats.absent / totalStudents) * 100 : 0 },
    { name: 'Izin/Sakit', percentage: totalStudents ? (attendanceStats.permission / totalStudents) * 100 : 0 },
  ];

  // Prepare performance data for charts
  const performanceDataForChart = performanceData ? [
    { name: 'Kehadiran Sempurna', value: performanceData.perfectAttendance },
    { name: 'Kehadiran Tinggi', value: performanceData.highAttendance },
    { name: 'Kehadiran Sedang', value: performanceData.mediumAttendance },
    { name: 'Kehadiran Rendah', value: performanceData.lowAttendance },
  ] : [];

  // Prepare scatter data for performance visualization
  const scatterData = performanceData ? [
    { category: 'Kehadiran Sempurna', count: performanceData.perfectAttendance, value: 4 },
    { category: 'Kehadiran Tinggi', count: performanceData.highAttendance, value: 3 },
    { category: 'Kehadiran Sedang', count: performanceData.mediumAttendance, value: 2 },
    { category: 'Kehadiran Rendah', count: performanceData.lowAttendance, value: 1 },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attendance Distribution Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Distribusi Status Kehadiran
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Status Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Jumlah Siswa Berdasarkan Status Kehadiran
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attendanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="value" name="Jumlah Siswa">
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Trend Area Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Persentase Status Kehadiran
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={areaChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="percentage" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
                name="Persentase"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Statistics Bar Chart */}
      {performanceData && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Statistik Performa Kehadiran
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceDataForChart}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" name="Jumlah Siswa">
                  {performanceDataForChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PERFORMANCE_COLORS[index % PERFORMANCE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Promotion Status Radar Chart (if promotion stats available) */}
      {promotionStats && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Status Kenaikan Kelas (Radar View)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={promotionData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar
                  name="Status Kenaikan"
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
      )}

      {/* Performance Scatter Chart */}
      {performanceData && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Distribusi Performa Kehadiran
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="category" 
                  dataKey="category" 
                  name="Kategori" 
                />
                <YAxis 
                  type="number" 
                  dataKey="value" 
                  name="Tingkat" 
                  domain={[0, 5]}
                  tickCount={6}
                />
                <ZAxis 
                  type="number" 
                  dataKey="count" 
                  range={[100, 1000]} 
                  name="Jumlah Siswa" 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Scatter 
                  name="Performa Kehadiran" 
                  data={scatterData} 
                  fill="#8884d8"
                >
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PERFORMANCE_COLORS[index % PERFORMANCE_COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Performance Line Chart */}
      {performanceData && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Tren Performa Kehadiran
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceDataForChart}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Jumlah Siswa"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceStatusDiagram;