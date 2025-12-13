'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Printer } from 'lucide-react';

const TestPrintPage = () => {
  const { settings } = useSettings();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen p-6 ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header - This will be hidden during print */}
        <div className="mb-8 no-print">
          <h1 className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>
            Test Print Functionality
          </h1>
          <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            This page demonstrates the print functionality. When you click the print button, 
            only the report content will be printed with a clean, professional layout.
          </p>
          
          <button
            onClick={handlePrint}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${
              settings.theme === 'dark'
                ? 'bg-blue-700 text-white hover:bg-blue-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Printer className="w-5 h-5" />
            Print Report
          </button>
        </div>

        {/* Report Container - This will be visible during print */}
        <div className="report-container">
          <div className={`rounded-2xl p-8 shadow-lg ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="text-center mb-8 report-header">
              <h1 className="text-2xl font-bold mb-2">LAPORAN KEHADIRAN SISWA</h1>
              <h2 className="text-xl font-semibold mb-4">SMA NEGERI 1 JAKARTA</h2>
              <div className="border-t-2 border-blue-500 w-32 mx-auto"></div>
              <p className="mt-4 text-gray-600">Periode: 1-31 Mei 2024</p>
            </div>

            <div className="mb-8 report-section">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Ringkasan Kehadiran</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <p className="text-sm text-gray-600">Total Siswa</p>
                  <p className="text-2xl font-bold">120</p>
                </div>
                <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <p className="text-sm text-gray-600">Hadir</p>
                  <p className="text-2xl font-bold">112</p>
                  <p className="text-sm text-gray-600">(93.3%)</p>
                </div>
                <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                  <p className="text-sm text-gray-600">Terlambat</p>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-gray-600">(4.2%)</p>
                </div>
                <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-600">Tidak Hadir</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-gray-600">(2.5%)</p>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Daftar Siswa</h3>
              <div className="overflow-x-auto">
                <table className="report-table min-w-full">
                  <thead>
                    <tr className={`${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <th className="py-2 px-4 text-left">NIS</th>
                      <th className="py-2 px-4 text-left">Nama</th>
                      <th className="py-2 px-4 text-left">Kelas</th>
                      <th className="py-2 px-4 text-center">Hadir</th>
                      <th className="py-2 px-4 text-center">Terlambat</th>
                      <th className="py-2 px-4 text-center">Tidak Hadir</th>
                      <th className="py-2 px-4 text-center">Tingkat Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`border-t ${settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-2 px-4">12345</td>
                      <td className="py-2 px-4">Ahmad Rifai</td>
                      <td className="py-2 px-4">X-IPA-1</td>
                      <td className="py-2 px-4 text-center">28</td>
                      <td className="py-2 px-4 text-center">2</td>
                      <td className="py-2 px-4 text-center">0</td>
                      <td className="py-2 px-4 text-center">100%</td>
                    </tr>
                    <tr className={`border-t ${settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-2 px-4">12346</td>
                      <td className="py-2 px-4">Budi Santoso</td>
                      <td className="py-2 px-4">X-IPA-1</td>
                      <td className="py-2 px-4 text-center">25</td>
                      <td className="py-2 px-4 text-center">3</td>
                      <td className="py-2 px-4 text-center">2</td>
                      <td className="py-2 px-4 text-center">90%</td>
                    </tr>
                    <tr className={`border-t ${settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-2 px-4">12347</td>
                      <td className="py-2 px-4">Citra Dewi</td>
                      <td className="py-2 px-4">X-IPA-2</td>
                      <td className="py-2 px-4 text-center">27</td>
                      <td className="py-2 px-4 text-center">1</td>
                      <td className="py-2 px-4 text-center">2</td>
                      <td className="py-2 px-4 text-center">93.3%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 no-print">
              <p>Laporan ini dihasilkan oleh Sistem Monitoring Kehadiran dan Kenaikan Kelas</p>
              <p className="mt-1">Tanggal cetak: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPrintPage;