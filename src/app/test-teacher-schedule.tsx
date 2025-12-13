'use client';

import React from 'react';
import TeacherScheduleTab from './components/TeacherScheduleTab';
import type { Settings } from '@/contexts/SettingsContext';

const TestTeacherSchedule = () => {
  // Mock settings and setShowNotification for testing
  const mockSettings: Settings = {
    school_name: 'Test School',
    academic_year: '2025/2026',
    semester: 'Ganjil',
    start_time: '07:00',
    end_time: '15:00',
    notifications: true,
    language: 'id',
    theme: 'light'
  };
  
  const mockSetShowNotification = (show: boolean) => {
    console.log('Show notification:', show);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test Teacher Schedule Component</h1>
      <TeacherScheduleTab 
        settings={mockSettings} 
        setShowNotification={mockSetShowNotification} 
      />
    </div>
  );
};

export default TestTeacherSchedule;