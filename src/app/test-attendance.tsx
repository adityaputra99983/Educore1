'use client';

import React, { useState, useEffect } from 'react';
import { updateAttendance, getStudents } from '@/utils/api';

const TestAttendancePage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getStudents();
        setStudents(response.students || response);
      } catch (error) {
        console.error('Error fetching students:', error);
        setMessage('Error fetching students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleTestAttendance = async (studentId: number, status: string) => {
    try {
      setLoading(true);
      const response = await updateAttendance(studentId, status);
      if (response.success) {
        setMessage(`Successfully updated attendance for student ${studentId} to ${status}`);
        // Refresh student list
        const response2 = await getStudents();
        setStudents(response2.students || response2);
      } else {
        setMessage(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      setMessage('Error updating attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Test Attendance Functionality</h1>
      
      {message && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
          {message}
        </div>
      )}
      
      {loading && (
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          Loading...
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
            <p className="text-gray-600 mb-2">NIS: {student.nis}</p>
            <p className="text-gray-600 mb-4">Class: {student.class}</p>
            
            <div className="mb-4">
              <p className="font-medium">Current Status: 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  student.status === 'hadir' ? 'bg-green-100 text-green-800' :
                  student.status === 'terlambat' ? 'bg-yellow-100 text-yellow-800' :
                  student.status === 'tidak-hadir' ? 'bg-red-100 text-red-800' :
                  student.status === 'izin' ? 'bg-blue-100 text-blue-800' :
                  student.status === 'sakit' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {student.status}
                </span>
              </p>
              <p className="text-gray-600">Time: {student.time}</p>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleTestAttendance(student.id, 'hadir')}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Set Hadir
              </button>
              <button
                onClick={() => handleTestAttendance(student.id, 'terlambat')}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Set Terlambat
              </button>
              <button
                onClick={() => handleTestAttendance(student.id, 'tidak-hadir')}
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Set Tidak Hadir
              </button>
              <button
                onClick={() => handleTestAttendance(student.id, 'izin')}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Set Izin
              </button>
              <button
                onClick={() => handleTestAttendance(student.id, 'sakit')}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Set Sakit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestAttendancePage;