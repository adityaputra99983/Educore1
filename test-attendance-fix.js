// Test script to verify attendance fix
console.log('Testing attendance fix...');

// Mock student data
const mockStudents = [
  { id: 1, nis: '2024001', name: 'Ahmad Fauzi', class: 'XII-IPA-1', status: 'hadir', time: '07:15', photo: 'AF', attendance: 95, late: 2, absent: 1, permission: 2, type: 'existing' },
  { id: 2, nis: '2024002', name: 'Siti Nurhaliza', class: 'XII-IPA-1', status: 'terlambat', time: '07:45', photo: 'SN', attendance: 92, late: 5, absent: 2, permission: 1, type: 'existing' }
];

// Mock data manager
class MockDataManager {
  constructor() {
    this.students = [...mockStudents];
  }
  
  getStudents() {
    return this.students;
  }
  
  updateStudentAttendance(studentId, newStatus, newTime) {
    const studentIndex = this.students.findIndex(student => student.id === studentId);
    if (studentIndex === -1) return false;
    
    // Update attendance statistics based on new status
    const student = this.students[studentIndex];
    let updatedLate = student.late || 0;
    let updatedAbsent = student.absent || 0;
    let updatedPermission = student.permission || 0;
    
    // Adjust statistics based on previous and new status
    switch (student.status) {
      case 'hadir':
        break;
      case 'terlambat':
        updatedLate = Math.max(0, updatedLate - 1);
        break;
      case 'tidak-hadir':
        updatedAbsent = Math.max(0, updatedAbsent - 1);
        break;
      case 'izin':
      case 'sakit':
        updatedPermission = Math.max(0, updatedPermission - 1);
        break;
    }
    
    // Increase new status count
    switch (newStatus) {
      case 'hadir':
        break;
      case 'terlambat':
        updatedLate = updatedLate + 1;
        break;
      case 'tidak-hadir':
        updatedAbsent = updatedAbsent + 1;
        break;
      case 'izin':
      case 'sakit':
        updatedPermission = updatedPermission + 1;
        break;
    }
    
    // Recalculate attendance percentage
    const totalDays = 100;
    const presentDays = totalDays - updatedAbsent - updatedPermission;
    const updatedAttendance = Math.max(0, Math.min(100, Math.round((presentDays / totalDays) * 100)));
    
    // Update the student record
    this.students[studentIndex] = {
      ...student,
      status: newStatus,
      time: newTime,
      attendance: updatedAttendance,
      late: updatedLate,
      absent: updatedAbsent,
      permission: updatedPermission
    };
    
    // Dispatch event (in real implementation)
    console.log(`Attendance updated for student ${studentId}: ${newStatus}`);
    console.log(`New attendance: ${updatedAttendance}%`);
    
    return true;
  }
  
  calculateAttendanceStats() {
    const presentCount = this.students.filter(s => s.status === 'hadir').length;
    const lateCount = this.students.filter(s => s.status === 'terlambat').length;
    const absentCount = this.students.filter(s => s.status === 'tidak-hadir').length;
    const permissionCount = this.students.filter(s => s.status === 'izin' || s.status === 'sakit').length;
    const totalCount = this.students.length;
    
    const attendanceRate = totalCount > 0 
      ? Math.round(((presentCount + lateCount) / totalCount) * 1000) / 10
      : 0;
    
    return {
      totalStudents: totalCount,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      permission: permissionCount,
      attendanceRate: attendanceRate
    };
  }
}

// Test the fix
const dataManager = new MockDataManager();

console.log('Initial students:');
console.log(dataManager.getStudents());

console.log('\nInitial attendance stats:');
console.log(dataManager.calculateAttendanceStats());

console.log('\nUpdating student 1 from hadir to tidak-hadir...');
dataManager.updateStudentAttendance(1, 'tidak-hadir', '08:00');

console.log('\nUpdated students:');
console.log(dataManager.getStudents());

console.log('\nUpdated attendance stats:');
console.log(dataManager.calculateAttendanceStats());

console.log('\nTest completed successfully!');