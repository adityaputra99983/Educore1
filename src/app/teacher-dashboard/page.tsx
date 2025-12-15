'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'teacher') {
      router.push('/');
      return;
    }
    
    // Verify token
    fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
      if (data.valid) {
        setUser(data.user);
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        router.push('/');
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Verification error:', err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      router.push('/');
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Teacher Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>
      
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h2>
            <p className="text-gray-300">You are logged in as a teacher with secure authentication.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">My Schedule</h3>
              <p className="text-gray-300">View and manage your teaching schedule.</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Student Attendance</h3>
              <p className="text-gray-300">Track and record student attendance.</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Class Reports</h3>
              <p className="text-gray-300">Generate and view class performance reports.</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Resources</h3>
              <p className="text-gray-300">Access teaching materials and resources.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}