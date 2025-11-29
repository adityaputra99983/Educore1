import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
    school_name: string;
    academic_year: string;
    semester: string;
    start_time: string;
    end_time: string;
    notifications: boolean;
    language: string;
    theme: string;
}

const SettingsSchema: Schema = new Schema({
    school_name: { type: String },
    academic_year: { type: String },
    semester: { type: String },
    start_time: { type: String },
    end_time: { type: String },
    notifications: { type: Boolean },
    language: { type: String },
    theme: { type: String }
}, {
    timestamps: true
});

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
