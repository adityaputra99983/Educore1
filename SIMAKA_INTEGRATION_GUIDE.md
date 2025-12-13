# SIMAKA System Integration Guide

This document explains how all APIs in the NOAH attendance system are connected to the SIMAKA system.

## Overview

The NOAH attendance system is fully integrated with the SIMAKA (Sistem Informasi Manajemen Akademik) system through RESTful APIs. All data is stored in a MongoDB database and accessed through standardized API endpoints.

## Database Connection

The system connects to MongoDB using the connection string in the `.env.local` file:
```
MONGODB_URI="mongodb+srv://noahdb:NoahSchool2024@cluster0.ndikkxq.mongodb.net/noahdb?retryWrites=true&w=majority&appName=Cluster0"
```

The database connection is managed through `src/lib/db.ts` which implements connection pooling and caching for optimal performance.

## API Endpoints

All API endpoints follow the Next.js App Router convention and are located in `src/app/api/`.

### 1. Students API (`/api/students`)

#### Endpoints:
- `GET /api/students` - Retrieve all students with optional filtering
- `POST /api/students` - Add a new student
- `GET /api/students/[id]` - Get specific student details
- `DELETE /api/students/[id]` - Remove a student
- `PUT /api/students/class` - Update student's current class
- `PUT /api/students/promotion` - Update student promotion/graduation status
- `GET /api/students/details` - Get all students with detailed information
- `GET /api/students/violations` - Get all students with violations data

#### Features:
- Student registration and management
- Class assignment
- Promotion/lulus status tracking
- Violations and achievements tracking

### 2. Attendance API (`/api/attendance`)

#### Endpoints:
- `GET /api/attendance` - Get attendance records with filtering
- `PUT /api/attendance` - Update attendance status for a student

#### Features:
- Real-time attendance tracking
- Status updates (hadir, terlambat, tidak-hadir, izin, sakit)
- Automatic statistics calculation
- Time recording

### 3. Reports API (`/api/reports`)

#### Endpoints:
- `GET /api/reports?type=[type]&period=[period]` - Generate reports
- `POST /api/reports` - Export reports in PDF or Excel format

#### Report Types:
- `summary` - Attendance summary statistics
- `performance` - Student performance metrics
- `detailed` - Detailed attendance records
- `class` - Class-wise attendance reports
- `promotion` - Student promotion reports
- `attendance` - Comprehensive attendance data

#### Export Formats:
- PDF
- Excel (XLSX)

### 4. Settings API (`/api/settings`)

#### Endpoints:
- `GET /api/settings` - Retrieve system settings
- `PUT /api/settings` - Update system settings

#### Features:
- School information management
- Academic year and semester settings
- Time configurations
- Theme preferences

### 5. Teachers API (`/api/teachers`)

#### Endpoints:
- `GET /api/teachers` - Retrieve all teachers
- `POST /api/teachers` - Add a new teacher
- `GET /api/teachers/[id]` - Get specific teacher details
- `DELETE /api/teachers/[id]` - Remove a teacher
- `GET /api/teachers/[id]/schedule` - Get teacher's schedule
- `PUT /api/teachers/[id]/schedule` - Update teacher's schedule

#### Features:
- Teacher registration and management
- Schedule management
- Subject assignment

### 6. Health Check API (`/api/health-check`)

#### Endpoints:
- `GET /api/health-check` - Check database connectivity and system status

## Frontend Integration

The frontend uses utility functions in `src/utils/api.ts` to communicate with the backend APIs. These functions provide:

- Standardized error handling
- Request/response logging
- Type validation
- Event dispatching for real-time updates

## Authentication and Security

The system implements session-based authentication:
- Login verification through `/login` page
- Session management
- Role-based access control (admin only)

## Testing Integration

To verify that all APIs are properly connected to the SIMAKA system:

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/test-integration` to run the integration test
3. Check the results to confirm all APIs are functioning correctly

## Troubleshooting

Common issues and solutions:

1. **Database Connection Errors**:
   - Verify the MONGODB_URI in `.env.local`
   - Check network connectivity
   - Ensure MongoDB Atlas IP whitelist includes your IP

2. **API Endpoint Errors**:
   - Check server logs for specific error messages
   - Verify request payloads match expected formats
   - Ensure required fields are provided

3. **Performance Issues**:
   - Check database indexing
   - Review query efficiency
   - Monitor server resources

## Conclusion

All APIs in the NOAH attendance system are fully integrated with the SIMAKA system through standardized RESTful endpoints. The system provides comprehensive functionality for student management, attendance tracking, reporting, and teacher scheduling while maintaining secure and reliable data storage in MongoDB.