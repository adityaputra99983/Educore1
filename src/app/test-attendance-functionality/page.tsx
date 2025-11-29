'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateAttendance, getStudents } from '@/utils/api';

const TestAttendanceFunctionality = () => {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');

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

  const handleAttendanceUpdate = async () => {
    if (!selectedStudent || !selectedStatus) {
      setMessage('Please select both student and status');
      return;
    }

    try {
      setLoading(true);
      const response = await updateAttendance(selectedStudent, selectedStatus);
      
      if (response.success) {
        setMessage(`Successfully updated attendance for ${students.find(s => s.id === selectedStudent)?.name}`);
        
        // Refresh student list
        const response2 = await getStudents();
        setStudents(response2.students || response2);
        
        // Reset selection
        setSelectedStudent(null);
        setSelectedStatus('');
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Test Attendance Functionality</h1>
        
        {message && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
            {message}
          </div>
        )}
        
        {loading && (
          <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            Processing...
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Attendance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
              <select
                value={selectedStudent || ''}
                onChange={(e) => setSelectedStudent(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Choose a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.nis}) - {student.class}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Choose a status</option>
                <option value="hadir">Hadir</option>
                <option value="terlambat">Terlambat</option>
                <option value="tidak-hadir">Tidak Hadir</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleAttendanceUpdate}
              disabled={loading || !selectedStudent || !selectedStatus}
              className={`px-6 py-2 rounded-lg font-medium ${
                loading || !selectedStudent || !selectedStatus
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Update Attendance
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="ml-4 px-6 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Student List</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                          {student.photo}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.nis}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{student.class}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'hadir' 
                          ? 'bg-green-100 text-green-800' 
                          : student.status === 'terlambat' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : student.status === 'tidak-hadir' 
                              ? 'bg-red-100 text-red-800' 
                              : student.status === 'izin' 
                                ? 'bg-blue-100 text-blue-800' 
                                : student.status === 'sakit' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status === 'hadir' ? 'Hadir' :
                         student.status === 'terlambat' ? 'Terlambat' :
                         student.status === 'tidak-hadir' ? 'Tidak Hadir' :
                         student.status === 'izin' ? 'Izin' :
                         student.status === 'sakit' ? 'Sakit' : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{student.time}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${student.attendance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{student.attendance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAttendanceFunctionality;