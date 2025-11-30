# NOAH - Sistem Manajemen Edukasi

## Overview
NOAH is a modern educational management system built with Next.js 13+ App Router, TypeScript, and Tailwind CSS. It provides comprehensive features for managing student attendance, schedules, reports, and more.

## Key Features
- Student attendance tracking
- Teacher schedule management
- Detailed reporting and analytics with modern UI
- Promotion and graduation tracking
- Modern UI with dark/light theme support

## Recent Improvements

### 1. Enhanced Attendance Tracking
- Added new 'belum-diisi' status for students whose attendance hasn't been recorded yet
- Fixed issue where all students appeared as "present" when no attendance was recorded
- Improved dashboard statistics to accurately reflect attendance status

### 2. Enhanced Type Safety
- Added strict TypeScript interfaces for all data models
- Improved type definitions for student, teacher, and settings objects
- Added proper typing for API responses

### 3. Better Error Handling
- Added comprehensive input validation in all API routes
- Implemented proper error responses with meaningful messages
- Added try/catch blocks around critical operations
- Improved error logging for debugging

### 4. Data Manager Improvements
- Enhanced singleton pattern implementation
- Added better error handling for data operations
- Improved data validation and sanitization

### 5. API Route Enhancements
- Added input validation for all API endpoints
- Improved error responses with proper HTTP status codes
- Added better parameter validation
- Enhanced security checks

### 6. Client-Side Improvements
- Added better loading states
- Improved error handling in data fetching
- Enhanced form validation
- Better TypeScript typing for components

### 7. Reports Section Improvements
- Created a dedicated, modern reports page (`/reports`) with enhanced UI/UX
- Added interactive data visualizations with Chart.js (bar and pie charts)
- Improved data presentation with summary cards and detailed tables
- Enhanced export functionality with better formatting (PDF and Excel)
- Added comprehensive test pages to verify functionality
- Implemented real-time data updates through API connectivity

## API Endpoints

### Students
- `GET /api/students` - Get all students with filtering
- `POST /api/students` - Add a new student
- `GET /api/students/[id]` - Get student details
- `PUT /api/students/promotion` - Update student promotion status
- `PUT /api/students/class` - Update student class

### Attendance
- `GET /api/attendance` - Get attendance records
- `PUT /api/attendance` - Update attendance status

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Add a new teacher
- `GET /api/teachers/[id]/schedule` - Get teacher schedule
- `PUT /api/teachers/[id]/schedule` - Update teacher schedule

### Reports
- `GET /api/reports` - Generate reports
- `POST /api/reports` - Export reports (PDF/Excel)

### Settings
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update system settings

## Technologies Used
- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS
- React with Context API
- pdfmake for PDF generation
- xlsx for Excel export
- lucide-react for icons

## Setup Instructions
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Build for production: `npm run build`
4. Start production server: `npm start`

## Vercel Deployment Instructions
1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add the following environment variables in your Vercel project settings:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
4. Deploy!

Note: For MongoDB Atlas connections, ensure your IP whitelist includes Vercel's IP ranges or is set to allow access from anywhere (0.0.0.0/0) for testing purposes.

## Database Migration
To update existing students' status from 'hadir' to 'belum-diisi' for students who haven't actually had their attendance recorded:
```bash
npm run update-students
```

## Contributing
This project is designed to be robust and error-resistant. All API routes include proper validation and error handling. Client components implement proper loading states and error boundaries.

## License
This is a proprietary educational management system.
