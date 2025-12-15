import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'teacher' | 'admin' | 'staff';
  teacherId?: number; // Reference to teacher if applicable
  name: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  role: { 
    type: String, 
    enum: ['teacher', 'admin', 'staff'],
    required: true,
    default: 'staff'
  },
  teacherId: { 
    type: Number,
    ref: 'Teacher'
  },
  name: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    // Type assertion to ensure password is treated as string
    const password = this.get('password') as string;
    this.password = await bcrypt.hash(password, salt);
    next();
  } catch (error: unknown) {
    // Handle unknown error type properly according to project specifications
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('An unknown error occurred during password hashing'));
    }
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;