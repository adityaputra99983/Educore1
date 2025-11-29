'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { BarChart3 } from 'lucide-react';

const ReportsLoading = () => {
  const { settings } = useSettings();
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <h2 className={`text-2xl font-bold mb-2 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Memuat Laporan Kehadiran dan Kenaikan Kelas
        </h2>
        <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
          Sedang menyiapkan data laporan kehadiran dan kenaikan kelas
        </p>
        <div className={`inline-block px-4 py-2 rounded-full ${settings.theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          <BarChart3 className="w-5 h-5 inline mr-2" />
          Menghubungkan ke API...
        </div>
      </div>
    </div>
  );
};

export default ReportsLoading;