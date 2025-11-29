'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Search, Filter, UserPlus, ArrowRightLeft, CheckCircle, Clock, XCircle, Shield, Heart, Trash2, Eye, SortAsc, SortDesc, Calendar, UserCheck, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { getStudents, removeStudent as apiRemoveStudent, updateAttendance } from '@/utils/api';
import { useSettings } from '@/contexts/SettingsContext';

interface Student {
  id: number;
  nis: string;
  name: string;
  class: string;
  status: string;
  time: string;
  photo: string;
  attendance: number;
  late: number;
  absent: number;
  permission: number;
  type: string;
  violations?: number;
  achievements?: number;
  // New fields for promotion and graduation tracking
  promotionStatus?: 'naik' | 'tinggal' | 'lulus' | 'belum-ditetapkan';
  graduationStatus?: 'lulus' | 'belum-lulus';
  previousClass?: string;
  nextClass?: string;
  // Tracking fields
  createdAt?: string;
  updatedAt?: string;
}

const StudentListPage = () => {
  const router = useRouter();
  const { settings } = useSettings();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPromotionStatus, setSelectedPromotionStatus] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // 'success' or 'error'
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'asc' | 'desc' } | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // Calculate statistics
  const calculateStatistics = () => {
    const totalStudents = students.length;
    const newStudents = students.filter(s => s.type === 'new').length;
    const transferStudents = students.filter(s => s.type === 'transfer').length;
    const presentStudents = students.filter(s => s.status === 'hadir').length;
    const absentStudents = students.filter(s => s.status === 'tidak-hadir').length;
    const lateStudents = students.filter(s => s.status === 'terlambat').length;
    
    return {
      totalStudents,
      newStudents,
      transferStudents,
      presentStudents,
      absentStudents,
      lateStudents,
      attendanceRate: totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0
    };
  };

  const stats = calculateStatistics();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getStudents();
        // Add tracking information if not present
        const studentsWithTracking = response.students.map((student: any) => ({
          ...student,
          createdAt: student.createdAt || new Date().toISOString(),
          updatedAt: student.updatedAt || new Date().toISOString()
        }));
        setStudents(studentsWithTracking);
        setFilteredStudents(studentsWithTracking);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
    
    // Add event listener for attendance updates
    const handleAttendanceUpdate = (event: CustomEvent) => {
      // Refresh student data when attendance is updated
      fetchStudents();
      
      // Show notification if needed
      if (event.detail && event.detail.updatedStudent) {
        setNotificationMessage(`${event.detail.updatedStudent.name} - Absensi diperbarui menjadi ${event.detail.newStatus}`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    };
    
    // Add event listener for student class updates
    const handleClassUpdate = () => {
      fetchStudents();
    };
    
    // Add event listener for manual refresh
    const handleManualRefresh = () => {
      fetchStudents();
    };
    
    window.addEventListener('attendanceUpdated', handleAttendanceUpdate as EventListener);
    window.addEventListener('studentClassUpdated', handleClassUpdate);
    window.addEventListener('studentListRefresh', handleManualRefresh);
    
    // Clean up
    return () => {
      window.removeEventListener('attendanceUpdated', handleAttendanceUpdate as EventListener);
      window.removeEventListener('studentClassUpdated', handleClassUpdate);
      window.removeEventListener('studentListRefresh', handleManualRefresh);
    };
  }, []);

  useEffect(() => {
    let result = [...students];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(student => 
        student.name.toLowerCase().includes(query) || 
        (student.nis && student.nis.includes(query))
      );
    }
    
    // Apply class filter
    if (selectedClass !== 'all') {
      result = result.filter(student => student.class === selectedClass);
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      result = result.filter(student => student.type === selectedType);
    }
    
    // Apply promotion status filter
    if (selectedPromotionStatus !== 'all') {
      result = result.filter(student => student.promotionStatus === selectedPromotionStatus);
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        // Handle potential undefined values
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredStudents(result);
  }, [searchQuery, selectedClass, selectedType, selectedPromotionStatus, students, sortConfig]);

  const requestSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStudentTypeBadge = (type: string) => {
    if (type === 'new') {
      return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        settings.theme === 'dark' 
          ? 'bg-green-900/30 text-green-400 border border-green-800' 
          : 'bg-green-100 text-green-700'
      }`}>
        <UserPlus className="w-3 h-3" />
        Baru
      </span>;
    } else if (type === 'transfer') {
      return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        settings.theme === 'dark' 
          ? 'bg-orange-900/30 text-orange-400 border border-orange-800' 
          : 'bg-orange-100 text-orange-700'
      }`}>
        <ArrowRightLeft className="w-3 h-3" />
        Pindahan
      </span>;
    }
    return null;
  };

  // Function to get promotion status badge
  const getPromotionStatusBadge = (promotionStatus: string | undefined) => {
    if (!promotionStatus || promotionStatus === 'belum-ditetapkan') {
      return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        settings.theme === 'dark' 
          ? 'bg-gray-700 text-gray-300 border border-gray-600' 
          : 'bg-gray-200 text-gray-700'
      }`}>
        Belum Ditentukan
      </span>;
    }
    
    if (promotionStatus === 'naik') {
      return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        settings.theme === 'dark' 
          ? 'bg-green-900/30 text-green-400 border border-green-800' 
          : 'bg-green-100 text-green-700'
      }`}>
        <ArrowRightLeft className="w-3 h-3" />
        Naik Kelas
      </span>;
    }
    
    if (promotionStatus === 'tinggal') {
      return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        settings.theme === 'dark' 
          ? 'bg-red-900/30 text-red-400 border border-red-800' 
          : 'bg-red-100 text-red-700'
      }`}>
        <XCircle className="w-3 h-3" />
        Tinggal Kelas
      </span>;
    }
    
    if (promotionStatus === 'lulus') {
      return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        settings.theme === 'dark' 
          ? 'bg-blue-900/30 text-blue-400 border border-blue-800' 
          : 'bg-blue-100 text-blue-700'
      }`}>
        <CheckCircle className="w-3 h-3" />
        Lulus
      </span>;
    }
    
    return null;
  };

  // Function to get status text in Indonesian
  const getStatusText = (status: string) => {
    switch (status) {
      case 'hadir': return 'Hadir';
      case 'terlambat': return 'Terlambat';
      case 'tidak-hadir': return 'Tidak Hadir';
      case 'izin': return 'Izin';
      case 'sakit': return 'Sakit';
      default: return 'Belum Hadir';
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'hadir': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'terlambat': 'bg-amber-100 text-amber-700 border-amber-200',
      'tidak-hadir': 'bg-red-100 text-red-700 border-red-200',
      'izin': 'bg-blue-100 text-blue-700 border-blue-200',
      'sakit': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // Function to handle student removal
  const handleRemoveStudent = async (studentId: number, studentName: string) => {
    // Confirm before removing
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data siswa ${studentName}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    
    try {
      setLoading(true);
      const result = await apiRemoveStudent(studentId);
      
      if (result.success) {
        // Refresh the student list
        const response = await getStudents();
        setStudents(response.students);
        setFilteredStudents(response.students);
        
        // Show success notification
        setNotificationMessage(`Data siswa ${studentName} berhasil dihapus`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } else {
        throw new Error(result.message || 'Gagal menghapus data siswa');
      }
    } catch (error: any) {
      console.error('Error removing student:', error);
      setNotificationMessage(`Error: ${error.message || 'Gagal menghapus data siswa'}`);
      setNotificationType('error');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    
    // Confirm before removing
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${selectedStudents.length} data siswa? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    
    try {
      setLoading(true);
      let successCount = 0;
      
      // Delete each selected student
      for (const studentId of selectedStudents) {
        try {
          const result = await apiRemoveStudent(studentId);
          if (result.success) {
            successCount++;
          }
        } catch (error) {
          console.error(`Error deleting student ${studentId}:`, error);
        }
      }
      
      // Refresh the student list
      const response = await getStudents();
      setStudents(response.students);
      setFilteredStudents(response.students);
      setSelectedStudents([]);
      
      // Show success notification
      setNotificationMessage(`${successCount} dari ${selectedStudents.length} data siswa berhasil dihapus`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error: any) {
      console.error('Error bulk removing students:', error);
      setNotificationMessage(`Error: ${error.message || 'Gagal menghapus data siswa'}`);
      setNotificationType('error');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle student selection for bulk operations
  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  // Function to select all students
  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
  };

  // Function to update student attendance
  const handleAttendanceUpdate = async (studentId: number, newStatus: string) => {
    try {
      setLoading(true);
      const response = await updateAttendance(studentId, newStatus);
      
      if (response.success) {
        // Refresh the student list
        const response2 = await getStudents();
        setStudents(response2.students);
        setFilteredStudents(response2.students);
        
        // Show success notification
        const student = students.find(s => s.id === studentId);
        if (student) {
          setNotificationMessage(`${student.name} - Absensi diperbarui menjadi ${getStatusText(newStatus)}`);
          setNotificationType('success');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      } else {
        throw new Error(response.message || 'Gagal memperbarui absensi');
      }
    } catch (error: any) {
      console.error('Error updating attendance:', error);
      setNotificationMessage(`Error: ${error.message || 'Gagal memperbarui absensi'}`);
      setNotificationType('error');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Dark mode status color mapping
  const getDarkModeStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'hadir': 'bg-emerald-900/30 text-emerald-400 border-emerald-800',
      'terlambat': 'bg-amber-900/30 text-amber-400 border-amber-800',
      'tidak-hadir': 'bg-red-900/30 text-red-400 border-red-800',
      'izin': 'bg-blue-900/30 text-blue-400 border-blue-800',
      'sakit': 'bg-purple-900/30 text-purple-400 border-purple-800'
    };
    return colors[status] || 'bg-gray-800 text-gray-300 border-gray-700';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Notification */}
      {showNotification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in ${
          notificationType === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notificationMessage}
        </div>
      )}
      
      {/* Header */}
      <header className={`${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className={`flex items-center ${settings.theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} mr-4`}
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Kembali
              </button>
              <h1 className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Daftar Siswa</h1>
            </div>
            <button
              onClick={() => {
                const fetchStudents = async () => {
                  try {
                    setLoading(true);
                    const response = await getStudents();
                    setStudents(response.students);
                    setFilteredStudents(response.students);
                  } catch (error) {
                    console.error('Error fetching students:', error);
                  } finally {
                    setLoading(false);
                  }
                };
                fetchStudents();
              }}
              disabled={loading}
              className={`flex items-center px-4 py-2 rounded-lg ${settings.theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-xl p-4 ${settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${settings.theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <Users className={`w-6 h-6 ${settings.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Siswa</p>
                <p className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-4 ${settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${settings.theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <UserPlus className={`w-6 h-6 ${settings.theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Siswa Baru</p>
                <p className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.newStudents}</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-4 ${settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${settings.theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                <ArrowRightLeft className={`w-6 h-6 ${settings.theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Siswa Pindahan</p>
                <p className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.transferStudents}</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-4 ${settings.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${settings.theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                <TrendingUp className={`w-6 h-6 ${settings.theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Tingkat Kehadiran</p>
                <p className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-md p-6 mb-8 border`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Cari Siswa</label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input 
                  type="text" 
                  placeholder="Nama atau NIS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    settings.theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Kelas</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  settings.theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">Semua Kelas</option>
                <optgroup label="Kelas 10">
                  <option value="X-IPA-1">X-IPA-1</option>
                  <option value="X-IPA-2">X-IPA-2</option>
                  <option value="X-IPS-1">X-IPS-1</option>
                  <option value="X-IPS-2">X-IPS-2</option>
                </optgroup>
                <optgroup label="Kelas 11">
                  <option value="XI-IPA-1">XI-IPA-1</option>
                  <option value="XI-IPA-2">XI-IPA-2</option>
                  <option value="XI-IPS-1">XI-IPS-1</option>
                  <option value="XI-IPS-2">XI-IPS-2</option>
                </optgroup>
                <optgroup label="Kelas 12">
                  <option value="XII-IPA-1">XII-IPA-1</option>
                  <option value="XII-IPA-2">XII-IPA-2</option>
                  <option value="XII-IPS-1">XII-IPS-1</option>
                  <option value="XII-IPS-2">XII-IPS-2</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tipe Siswa</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  settings.theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">Semua Tipe</option>
                <option value="existing">Siswa Lama</option>
                <option value="new">Siswa Baru</option>
                <option value="transfer">Siswa Pindahan</option>
                {/* Promotion status filter options */}
                <option value="naik">Naik Kelas</option>
                <option value="tinggal">Tinggal Kelas</option>
                <option value="lulus">Lulus</option>
                <option value="belum-ditetapkan">Belum Ditentukan</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Status Kenaikan</label>
              <select 
                value={selectedPromotionStatus}
                onChange={(e) => setSelectedPromotionStatus(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  settings.theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">Semua Status</option>
                <option value="naik">Naik Kelas</option>
                <option value="tinggal">Tinggal Kelas</option>
                <option value="lulus">Lulus</option>
                <option value="belum-ditetapkan">Belum Ditentukan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className={`${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-md p-4 mb-4 border flex items-center justify-between`}>
            <div className="text-sm">
              {selectedStudents.length} siswa dipilih
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStudents([])}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  settings.theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Batal
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                  settings.theme === 'dark' 
                    ? 'bg-red-700 hover:bg-red-600 text-white disabled:opacity-50' 
                    : 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Terpilih
              </button>
            </div>
          </div>
        )}

        {/* Student List */}
        <div className={`${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-md overflow-hidden border`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <input
                      type="checkbox"
                      checked={selectedStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                      onChange={selectAllStudents}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} cursor-pointer`}
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Siswa
                      {sortConfig?.key === 'name' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} cursor-pointer`}
                    onClick={() => requestSort('class')}
                  >
                    <div className="flex items-center">
                      Kelas
                      {sortConfig?.key === 'class' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} cursor-pointer`}
                    onClick={() => requestSort('time')}
                  >
                    <div className="flex items-center">
                      Waktu
                      {sortConfig?.key === 'time' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} cursor-pointer`}
                    onClick={() => requestSort('attendance')}
                  >
                    <div className="flex items-center">
                      Kehadiran
                      {sortConfig?.key === 'attendance' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} cursor-pointer`}
                    onClick={() => requestSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Dibuat
                      {sortConfig?.key === 'createdAt' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Aksi</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${settings.theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className={settings.theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {student.photo}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{student.name}</div>
                          <div className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{student.nis}</div>
                        </div>
                        {getStudentTypeBadge(student.type)}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          settings.theme === 'dark' 
                            ? getDarkModeStatusColor(student.status) 
                            : getStatusColor(student.status)
                        }`}>
                          {getStatusText(student.status)}
                        </span>
                        {/* Quick attendance buttons */}
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleAttendanceUpdate(student.id, 'hadir')}
                            disabled={loading}
                            className={`p-1 rounded ${
                              student.status === 'hadir'
                                ? 'bg-emerald-500 text-white'
                                : settings.theme === 'dark'
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Hadir"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAttendanceUpdate(student.id, 'terlambat')}
                            disabled={loading}
                            className={`p-1 rounded ${
                              student.status === 'terlambat'
                                ? 'bg-amber-500 text-white'
                                : settings.theme === 'dark'
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Terlambat"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAttendanceUpdate(student.id, 'tidak-hadir')}
                            disabled={loading}
                            className={`p-1 rounded ${
                              student.status === 'tidak-hadir'
                                ? 'bg-red-500 text-white'
                                : settings.theme === 'dark'
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Tidak Hadir"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                      {student.time}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${student.attendance}%` }}
                          ></div>
                        </div>
                        <span>{student.attendance}%</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                      {student.createdAt && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(student.createdAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-1">
                        {getPromotionStatusBadge(student.promotionStatus)}
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => router.push(`/students/${student.id}`)}
                            className={`px-3 py-1 rounded-md text-sm flex items-center ${
                              settings.theme === 'dark' 
                                ? 'bg-blue-700 text-white hover:bg-blue-600' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </button>
                          <button
                            onClick={() => handleRemoveStudent(student.id, student.name)}
                            disabled={loading}
                            className={`px-3 py-1 rounded-md text-sm flex items-center ${
                              settings.theme === 'dark' 
                                ? 'bg-red-700 text-white hover:bg-red-600 disabled:opacity-50' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentListPage;