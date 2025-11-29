// Shared data manager to ensure consistency across all API routes
import type { Student } from '../types/student';
import type { Teacher, ScheduleItem } from '../types/teacher';

interface Settings {
  school_name: string;
  academic_year: string;
  semester: string;
  start_time: string;
  end_time: string;
  notifications: boolean;
  language: string;
  theme: string;
}

// Centralized data storage
export class DataManager {
  private static instance: DataManager | null = null;
  private students: Student[];
  private settings: Settings;
  private localStorageKey = 'noah_student_data';

  private constructor() {
    try {
      // Try to load data from localStorage first
      const savedData = this.loadFromLocalStorage();
      if (savedData) {
        console.log('Loading students from localStorage:', savedData.students);
        this.students = savedData.students;
        this.settings = savedData.settings;
      } else {
        // Initialize with default data if no saved data
        this.students = [
          // Default student data would go here if needed
        ];
        
        this.settings = {
          school_name: 'Educore',
          academic_year: '2025/2026',
          semester: 'Ganjil',
          start_time: '07:00',
          end_time: '15:00',
          notifications: true,
          language: 'id',
          theme: 'light'
        };
        
        console.log('Initializing with default students:', this.students);
        // Save initial data to localStorage
        this.saveToLocalStorage();
      }
    } catch (error) {
      console.error('Error initializing DataManager:', error);
      throw error;
    }
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      try {
        DataManager.instance = new DataManager();
      } catch (error) {
        console.error('Error creating DataManager instance:', error);
        throw error;
      }
    }
    return DataManager.instance;
  }

  // Student methods
  public getStudents(): Student[] {
    try {
      return this.students.map(student => ({
        ...student,
        violations: student.violations || 0,
        achievements: student.achievements || 0,
        promotionStatus: student.promotionStatus || 'belum-ditetapkan',
        graduationStatus: student.graduationStatus || 'belum-lulus',
        previousClass: student.previousClass || '',
        nextClass: student.nextClass || ''
      }));
    } catch (error) {
      console.error('Error in getStudents:', error);
      throw error;
    }
  }

  public removeStudent(studentId: number): boolean {
    try {
      console.log(`Attempting to remove student with ID: ${studentId}`);
      console.log(`Current students:`, this.students);
      const initialLength = this.students.length;
      
      // Convert studentId to number for comparison
      const targetId = Number(studentId);
      this.students = this.students.filter(student => Number(student.id) !== targetId);
      
      // Check if a student was actually removed
      const studentRemoved = this.students.length < initialLength;
      console.log(`Student removed: ${studentRemoved}, Initial length: ${initialLength}, New length: ${this.students.length}`);
      
      if (studentRemoved) {
        // Save to localStorage
        this.saveToLocalStorage();
      }
      
      return studentRemoved;
    } catch (error) {
      console.error('Error in removeStudent:', error);
      throw error;
    }
  }

  public getStudentById(id: number): Student | undefined {
    try {
      console.log(`Searching for student with ID: ${id}`);
      console.log(`Available students:`, this.students);
      
      // Convert id to number for comparison
      const targetId = Number(id);
      const student = this.students.find(student => Number(student.id) === targetId);
      console.log(`Found student:`, student);
      
      if (student) {
        const result = {
          ...student,
          violations: student.violations || 0,
          achievements: student.achievements || 0,
          promotionStatus: student.promotionStatus || 'belum-ditetapkan',
          graduationStatus: student.graduationStatus || 'belum-lulus',
          previousClass: student.previousClass || '',
          nextClass: student.nextClass || ''
        };
        console.log(`Returning student result:`, result);
        return result;
      }
      console.log(`No student found with ID: ${id}`);
      return undefined;
    } catch (error) {
      console.error('Error in getStudentById:', error);
      throw error;
    }
  }

  public updateStudentAttendance(studentId: number, newStatus: 'hadir' | 'terlambat' | 'tidak-hadir' | 'izin' | 'sakit', newTime: string): boolean {
    try {
      const studentIndex = this.students.findIndex(student => Number(student.id) === Number(studentId));
      if (studentIndex === -1) return false;
      
      // Update attendance statistics based on new status
      const student = this.students[studentIndex];
      let updatedLate = student.late || 0;
      let updatedAbsent = student.absent || 0;
      let updatedPermission = student.permission || 0;
      
      // Adjust statistics based on previous and new status
      // Decrease previous status count
      switch (student.status) {
        case 'hadir':
          // For present, we don't need to adjust anything as it's the base state
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
          // For present, we don't need to adjust anything as it's the base state
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
      
      // Recalculate attendance percentage based on updated statistics
      // Attendance percentage = (total present days + late days) / (total days) * 100
      // For simplicity, we'll use a fixed total of 100 days
      const totalDays = 100;
      const presentDays = totalDays - updatedAbsent - updatedPermission;
      const updatedAttendance = Math.max(0, Math.min(100, Math.round((presentDays / totalDays) * 100)));
      
      // Update the student record with new values
      this.students[studentIndex] = {
        ...student,
        status: newStatus,
        time: newTime,
        attendance: updatedAttendance,
        late: updatedLate,
        absent: updatedAbsent,
        permission: updatedPermission
      };
      
      // Save to localStorage
      this.saveToLocalStorage();
      
      // Dispatch custom event to notify UI components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('attendanceUpdated', { 
          detail: { 
            studentId, 
            newStatus, 
            updatedStudent: this.students[studentIndex],
            updatedAttendance,
            // Include updated stats for reports and dashboard
            updatedStats: this.calculateAttendanceStats(),
            studentCategories: this.calculateStudentCategories()
          } 
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateStudentAttendance:', error);
      throw error;
    }
  }

  public addStudent(student: Omit<Student, 'id'>): Student {
    try {
      const newId = Math.max(...this.students.map(s => s.id), 0) + 1;
      const newStudent: Student = {
        id: newId,
        ...student
      };
      this.students.push(newStudent);
      return newStudent;
    } catch (error) {
      console.error('Error in addStudent:', error);
      throw error;
    }
  }

  // New method to update student promotion status
  public updateStudentPromotionStatus(studentId: number, promotionStatus: 'naik' | 'tinggal' | 'lulus' | 'belum-ditetapkan', nextClass?: string): boolean {
    try {
      const studentIndex = this.students.findIndex(student => Number(student.id) === Number(studentId));
      if (studentIndex === -1) return false;
      
      const student = this.students[studentIndex];
      this.students[studentIndex] = {
        ...student,
        promotionStatus,
        previousClass: student.class,
        nextClass: nextClass || student.class
      };
      
      // If student is marked as graduated, also update graduation status
      if (promotionStatus === 'lulus') {
        this.students[studentIndex].graduationStatus = 'lulus';
      }
      
      // Save to localStorage
      this.saveToLocalStorage();
      
      return true;
    } catch (error) {
      console.error('Error in updateStudentPromotionStatus:', error);
      throw error;
    }
  }

  // New method to update student's current class
  public updateStudentClass(studentId: number, newClass: string): boolean {
    try {
      const studentIndex = this.students.findIndex(student => Number(student.id) === Number(studentId));
      if (studentIndex === -1) return false;
      
      const student = this.students[studentIndex];
      this.students[studentIndex] = {
        ...student,
        class: newClass
      };
      
      // Save to localStorage
      this.saveToLocalStorage();
      
      return true;
    } catch (error) {
      console.error('Error in updateStudentClass:', error);
      throw error;
    }
  }

  // Settings methods
  public getSettings(): Settings {
    try {
      return { ...this.settings }; // Return a copy to prevent direct mutation
    } catch (error) {
      console.error('Error in getSettings:', error);
      throw error;
    }
  }

  public updateSettings(newSettings: Partial<Settings>): void {
    try {
      this.settings = {
        ...this.settings,
        ...newSettings
      };
      
      // Save to localStorage
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error in updateSettings:', error);
      throw error;
    }
  }

  // Stats calculation methods
  public calculateAttendanceStats() {
    try {
      const presentCount = this.students.filter(s => s.status === 'hadir').length;
      const lateCount = this.students.filter(s => s.status === 'terlambat').length;
      const absentCount = this.students.filter(s => s.status === 'tidak-hadir').length;
      const permissionCount = this.students.filter(s => s.status === 'izin' || s.status === 'sakit').length;
      const totalCount = this.students.length;
      
      // Calculate attendance rate as percentage of students who are present or late
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
    } catch (error) {
      console.error('Error in calculateAttendanceStats:', error);
      throw error;
    }
  }

  public calculateStudentCategories() {
    try {
      return {
        totalStudents: this.students.length,
        newStudents: this.students.filter(s => s.type === 'new').length,
        transferStudents: this.students.filter(s => s.type === 'transfer').length,
        existingStudents: this.students.filter(s => s.type === 'existing').length
      };
    } catch (error) {
      console.error('Error in calculateStudentCategories:', error);
      throw error;
    }
  }

  // Teacher methods
  private teachers: Teacher[] = [
    {
      id: 1,
      name: 'Budi Santoko',
      subject: 'Matematika',
      photo: 'BS',
      schedule: [
        { id: 1, day: 'Senin', startTime: '07:00', endTime: '09:30', class: 'X-IPA-1', room: 'Ruang 101', description: 'Mengajar Bab 1: Aljabar' },
        { id: 2, day: 'Senin', startTime: '09:45', endTime: '12:15', class: 'XI-IPA-2', room: 'Ruang 102', description: 'Mengajar Bab 2: Geometri' },
        { id: 3, day: 'Selasa', startTime: '07:00', endTime: '09:30', class: 'XII-IPS-1', room: 'Ruang 103', description: 'Mengajar Bab 3: Statistika' },
        { id: 4, day: 'Selasa', startTime: '09:45', endTime: '12:15', class: 'X-IPS-2', room: 'Ruang 104', description: 'Mengajar Bab 4: Trigonometri' },
        { id: 5, day: 'Rabu', startTime: '07:00', endTime: '09:30', class: 'XI-IPS-1', room: 'Ruang 105', description: 'Mengajar Bab 5: Kalkulus Dasar' }
      ]
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      subject: 'Bahasa Indonesia',
      photo: 'SN',
      schedule: [
        { id: 1, day: 'Senin', startTime: '07:00', endTime: '09:30', class: 'XII-IPA-1', room: 'Ruang 201', description: 'Membahas Cerita Rakyat' },
        { id: 2, day: 'Senin', startTime: '09:45', endTime: '12:15', class: 'X-IPA-2', room: 'Ruang 202', description: 'Mengajar Puisi Angkatan 60' },
        { id: 3, day: 'Rabu', startTime: '07:00', endTime: '09:30', class: 'XI-IPS-2', room: 'Ruang 203', description: 'Mempelajari Drama Tradisional' },
        { id: 4, day: 'Rabu', startTime: '09:45', endTime: '12:15', class: 'XII-IPS-1', room: 'Ruang 204', description: 'Menulis Artikel Ilmiah' },
        { id: 5, day: 'Kamis', startTime: '07:00', endTime: '09:30', class: 'X-IPS-1', room: 'Ruang 205', description: 'Menganalisis Novel Terkenal' }
      ]
    },
    {
      id: 3,
      name: 'Ahmad Fauzi',
      subject: 'Fisika',
      photo: 'AF',
      schedule: [
        { id: 1, day: 'Selasa', startTime: '07:00', endTime: '09:30', class: 'XI-IPA-1', room: 'Ruang 301', description: 'Mengajar Bab 1: Mekanika' },
        { id: 2, day: 'Selasa', startTime: '09:45', endTime: '12:15', class: 'XII-IPA-2', room: 'Ruang 302', description: 'Mengajar Bab 2: Termodinamika' },
        { id: 3, day: 'Rabu', startTime: '07:00', endTime: '09:30', class: 'X-IPA-1', room: 'Ruang 303', description: 'Mengajar Bab 3: Gelombang Bunyi' },
        { id: 4, day: 'Rabu', startTime: '09:45', endTime: '12:15', class: 'XI-IPS-1', room: 'Ruang 304', description: 'Mengajar Bab 4: Optika' },
        { id: 5, day: 'Jumat', startTime: '07:00', endTime: '09:30', class: 'XII-IPS-2', room: 'Ruang 305', description: 'Mengajar Bab 5: Listrik Statis' }
      ]
    },
    // Adding a fourth teacher to prevent 404 errors when teacher ID 4 is requested
    {
      id: 4,
      name: 'Dewi Kartika',
      subject: 'Biologi',
      photo: 'DK',
      schedule: [
        { id: 1, day: 'Senin', startTime: '07:00', endTime: '09:30', class: 'XII-IPA-1', room: 'Ruang 401', description: 'Mengajar Bab 1: Sel dan Jaringan' },
        { id: 2, day: 'Selasa', startTime: '09:45', endTime: '12:15', class: 'X-IPA-2', room: 'Ruang 402', description: 'Mengajar Bab 2: Sistem Pernapasan' },
        { id: 3, day: 'Rabu', startTime: '07:00', endTime: '09:30', class: 'XI-IPA-1', room: 'Ruang 403', description: 'Mengajar Bab 3: Ekosistem' },
        { id: 4, day: 'Kamis', startTime: '09:45', endTime: '12:15', class: 'XII-IPS-2', room: 'Ruang 404', description: 'Mengajar Bab 4: Evolusi' },
        { id: 5, day: 'Jumat', startTime: '07:00', endTime: '09:30', class: 'X-IPS-1', room: 'Ruang 405', description: 'Mengajar Bab 5: Genetika' }
      ]
    }
  ];

  public getTeachers(): Teacher[] {
    try {
      return this.teachers;
    } catch (error) {
      console.error('Error in getTeachers:', error);
      throw error;
    }
  }

  public addTeacher(teacherData: Omit<Teacher, 'id'>): Teacher {
    try {
      const newId = Math.max(...this.teachers.map(t => t.id), 0) + 1;
      const newTeacher = {
        id: newId,
        ...teacherData
      };
      this.teachers.push(newTeacher);
      return newTeacher;
    } catch (error) {
      console.error('Error in addTeacher:', error);
      throw error;
    }
  }

  public getTeacherById(id: number): Teacher | undefined {
    try {
      return this.teachers.find(teacher => teacher.id === id);
    } catch (error) {
      console.error('Error in getTeacherById:', error);
      throw error;
    }
  }

  public updateTeacherSchedule(teacherId: number, scheduleData: ScheduleItem[]): boolean {
    try {
      // Validate teacherId
      if (!teacherId || typeof teacherId !== 'number' || teacherId <= 0) {
        console.error('Invalid teacher ID provided to updateTeacherSchedule:', teacherId);
        return false;
      }
      
      const teacherIndex = this.teachers.findIndex(teacher => teacher.id === teacherId);
      if (teacherIndex === -1) {
        console.error(`Teacher with ID ${teacherId} not found`);
        return false;
      }
      
      // Ensure each schedule item has a unique ID
      const scheduleWithIds = scheduleData.map((item, index) => ({
        ...item,
        id: item.id || Date.now() + index // Use existing ID or generate a new one
      }));
      
      this.teachers[teacherIndex].schedule = scheduleWithIds;
      return true;
    } catch (error) {
      console.error('Error in updateTeacherSchedule:', error);
      throw error;
    }
  }

  // New method to remove a teacher
  public removeTeacher(teacherId: number): boolean {
    try {
      const initialLength = this.teachers.length;
      this.teachers = this.teachers.filter(teacher => teacher.id !== teacherId);
      
      // Check if a teacher was actually removed
      const teacherRemoved = this.teachers.length < initialLength;
      
      if (teacherRemoved) {
        // Save to localStorage
        this.saveToLocalStorage();
      }
      
      return teacherRemoved;
    } catch (error) {
      console.error('Error in removeTeacher:', error);
      throw error;
    }
  }

  // Add localStorage persistence methods
  private loadFromLocalStorage(): { students: Student[]; settings: Settings } | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedData = localStorage.getItem(this.localStorageKey);
        console.log('Raw data from localStorage:', savedData);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('Parsed data from localStorage:', parsedData);
          const result = {
            students: parsedData.students.map((student: any) => ({
              ...student,
              id: Number(student.id), // Ensure ID is a number
              violations: student.violations || 0,
              achievements: student.achievements || 0,
              promotionStatus: student.promotionStatus || 'belum-ditetapkan',
              graduationStatus: student.graduationStatus || 'belum-lulus',
              previousClass: student.previousClass || '',
              nextClass: student.nextClass || ''
            })),
            settings: parsedData.settings
          };
          console.log('Processed data from localStorage:', result);
          return result;
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return null;
    }
  }

  private saveToLocalStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const dataToSave = {
          students: this.students.map(student => ({
            ...student,
            id: Number(student.id) // Ensure ID is a number when saving
          })),
          settings: this.settings
        };
        console.log('Saving data to localStorage:', dataToSave);
        localStorage.setItem(this.localStorageKey, JSON.stringify(dataToSave));
      }
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }
}
