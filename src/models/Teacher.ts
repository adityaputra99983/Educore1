import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IScheduleItem {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    class: string;
    room: string;
    description: string;
}

export interface ITeacher extends Document {
    id: number; // Keeping numeric ID for compatibility
    name: string;
    subject: string;
    photo: string;
    schedule: IScheduleItem[];
}

const ScheduleItemSchema = new Schema({
    id: { type: Number, required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    class: { type: String, required: true },
    room: { type: String, required: true },
    description: { type: String, default: '' }
}, { _id: false }); // Disable _id for subdocuments if we want to keep using numeric IDs strictly or just rely on the parent

const TeacherSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    photo: { type: String, default: '' },
    schedule: [ScheduleItemSchema]
}, {
    timestamps: true
});

const Teacher: Model<ITeacher> = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
