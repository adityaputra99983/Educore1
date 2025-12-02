import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudent extends Document {
    id: number; // Keeping numeric ID for compatibility with existing frontend
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
    // New fields for cumulative attendance tracking
    presentCount: number;
    lateCount: number;
    absentCount: number;
    permissionCount: number;
    totalAttendanceDays: number;
    type: 'existing' | 'new' | 'transfer';
    violations: number;
    achievements: number;
    promotionStatus: 'naik' | 'tinggal' | 'lulus' | 'belum-ditetapkan';
    graduationStatus: 'lulus' | 'belum-lulus';
    previousClass?: string;
    nextClass?: string;
}

const StudentSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    nis: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    class: { type: String, required: true },
    status: {
        type: String,
        enum: ['hadir', 'terlambat', 'tidak-hadir', 'izin', 'sakit', 'belum-diisi'],
        default: 'belum-diisi'
    },
    time: { type: String, default: '-' },
    photo: { type: String, default: '' },
    attendance: { type: Number, default: 0 },
    late: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    permission: { type: Number, default: 0 },
    // New fields for cumulative attendance tracking
    presentCount: { type: Number, default: 0 },
    lateCount: { type: Number, default: 0 },
    absentCount: { type: Number, default: 0 },
    permissionCount: { type: Number, default: 0 },
    totalAttendanceDays: { type: Number, default: 0 },
    type: {
        type: String,
        enum: ['existing', 'new', 'transfer'],
        default: 'existing'
    },
    violations: { type: Number, default: 0 },
    achievements: { type: Number, default: 0 },
    promotionStatus: {
        type: String,
        enum: ['naik', 'tinggal', 'lulus', 'belum-ditetapkan'],
        default: 'belum-ditetapkan'
    },
    graduationStatus: {
        type: String,
        enum: ['lulus', 'belum-lulus'],
        default: 'belum-lulus'
    },
    previousClass: { type: String },
    nextClass: { type: String }
}, {
    timestamps: true
});

// Handle model compilation error in Next.js hot reload
const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
