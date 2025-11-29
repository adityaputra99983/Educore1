export interface Student {
  id: number;
  nis: string;
  name: string;
  class: string;
  status: 'hadir' | 'terlambat' | 'tidak-hadir' | 'izin' | 'sakit' | 'belum-diisi';
  time: string;
  photo: string;
  attendance: number;
  late: number;
  absent: number;
  permission: number;
  type: 'existing' | 'new' | 'transfer';
  violations?: number;
  achievements?: number;
  // New fields for promotion and graduation tracking
  promotionStatus?: 'naik' | 'tinggal' | 'lulus' | 'belum-ditetapkan';
  graduationStatus?: 'lulus' | 'belum-lulus';
  previousClass?: string;
  nextClass?: string;
}