export interface AttendanceStats {
  totalStudents: number;
  present: number;
  late: number;
  absent: number;
  permission: number;
  attendanceRate: number;
}

export interface StudentCategoryStats {
  totalStudents: number;
  newStudents: number;
  transferStudents: number;
  existingStudents: number;
}

export interface TopPerformer {
  id: number;
  nis: string;
  name: string;
  class: string;
  attendance: number;
  late: number;
  absent: number;
  permission: number;
  type: 'existing' | 'new' | 'transfer';
}

export interface ClassDistribution {
  class: string;
  present: number;
  late: number;
  absent: number;
  permission: number;
}

export interface SummaryReportData {
  attendanceStats: AttendanceStats;
  studentCategories: StudentCategoryStats;
  topPerformers: TopPerformer[];
  classDistribution: ClassDistribution[];
}

export interface DetailedStudentStats {
  id: number;
  nis: string;
  name: string;
  class: string;
  currentStatus: 'hadir' | 'terlambat' | 'tidak-hadir' | 'izin' | 'sakit' | 'belum-diisi';
  currentTime: string;
  attendancePercentage: number;
  weeklyHistory?: Array<{
    date: string;
    status: 'hadir' | 'terlambat' | 'tidak-hadir' | 'izin' | 'sakit' | 'belum-diisi';
    time: string;
  }>;
  monthlySummary?: {
    present: number;
    late: number;
    absent: number;
    permission: number;
  };
}

export interface DetailedReportData {
  reportTitle: string;
  generatedAt: string;
  period: string;
  totalStudents: number;
  attendanceRate: number;
  detailedStats: DetailedStudentStats[];
}

export interface ClassReport {
  class: string;
  totalStudents: number;
  present: number;
  late: number;
  absent: number;
  permission: number;
  averageAttendance: number;
  promoted?: number;
  retained?: number;
  graduated?: number;
}

export interface ClassReportData {
  reportTitle: string;
  generatedAt: string;
  classReports: ClassReport[];
}

export interface PromotionStats {
  total: any;
  promoted: number;
  retained: number;
  graduated: number;
  undecided: number;
}

export interface PromotionStudentStats {
  id: number;
  nis: string;
  name: string;
  class: string;
  currentStatus: 'hadir' | 'terlambat' | 'tidak-hadir' | 'izin' | 'sakit' | 'belum-diisi';
  promotionStatus: 'naik' | 'tinggal' | 'lulus' | 'belum-ditetapkan';
  nextClass: string;
  currentTime: string;
  attendancePercentage: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  permissionCount: number;
  totalAttendanceDays: number;
}

export interface PromotionReportData {
  reportType: string;
  promotionStats: PromotionStats;
  detailedStats: PromotionStudentStats[];
  attendanceStats: AttendanceStats;
}

// Additional interfaces for the specific report structures used in the frontend
export interface StudentReportData {
  id: number;
  nis: string;
  name: string;
  class: string;
  present: number;
  late: number;
  absent: number;
  permission: number;
  attendance: number;
  promotionStatus: 'naik' | 'tinggal' | 'lulus' | 'belum-ditetapkan';
  time: string;
  type: 'existing' | 'new' | 'transfer';
}

export interface FullReportData {
  performanceData: { perfectAttendance: number; highAttendance: number; mediumAttendance: number; lowAttendance: number; } | undefined;
  reportType: string;
  students?: StudentReportData[];
  classReports?: ClassReport[];
  promotionStats?: PromotionStats;
  detailedStats?: PromotionStudentStats[];
  attendanceStats?: AttendanceStats;
  studentCategories?: StudentCategoryStats;
  topPerformers?: TopPerformer[];
  classDistribution?: ClassDistribution[];
  reportTitle?: string;
  generatedAt?: string;
  period?: string;
  totalStudents?: number;
  attendanceRate?: number;
}

export type ReportData = 
  | SummaryReportData 
  | DetailedReportData 
  | ClassReportData 
  | PromotionReportData
  | FullReportData;