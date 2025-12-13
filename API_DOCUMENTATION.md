# NOAH System API Documentation

This document provides detailed information about all API endpoints in the NOAH attendance system, which is integrated with the SIMAKA system.

## Base URL

All API endpoints are prefixed with `/api`. For example: `GET /api/students`

## Authentication

All endpoints require authentication through the web interface. No additional API keys are needed when accessing through the frontend.

## Rate Limiting

There are no explicit rate limits, but the system implements connection pooling and caching to handle reasonable loads.

## Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## Students API

### Get All Students
**GET** `/api/students`

Retrieves all students with optional filtering.

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| class | string | Filter by class (e.g., "X-IPA-1") |
| search | string | Search by name or NIS |
| type | string | Filter by student type ("existing", "new", "transfer") |
| promotionStatus | string | Filter by promotion status ("naik", "tinggal", "lulus", "belum-ditetapkan") |

#### Response
```json
{
  "success": true,
  "students": [
    {
      "id": 1,
      "nis": "12345",
      "name": "John Doe",
      "class": "X-IPA-1",
      "status": "hadir",
      "time": "07:30",
      "photo": "JD",
      "attendance": 95,
      "late": 2,
      "absent": 1,
      "permission": 0,
      "type": "existing",
      "promotionStatus": "naik",
      "nextClass": "XI-IPA-1"
    }
  ]
}
```

### Add New Student
**POST** `/api/students`

Adds a new student to the system.

#### Request Body
```json
{
  "nis": "12345",
  "name": "John Doe",
  "class": "X-IPA-1",
  "type": "new" // Optional: "existing", "new", "transfer"
}
```

#### Response
```json
{
  "success": true,
  "student": {
    "id": 1,
    "nis": "12345",
    "name": "John Doe",
    "class": "X-IPA-1",
    "status": "belum-diisi",
    "time": "-",
    "photo": "JD",
    "attendance": 0,
    "late": 0,
    "absent": 0,
    "permission": 0,
    "type": "new"
  }
}
```

### Get Student by ID
**GET** `/api/students/{id}`

Retrieves detailed information about a specific student.

#### Response
```json
{
  "success": true,
  "student": {
    "id": 1,
    "nis": "12345",
    "name": "John Doe",
    "class": "X-IPA-1",
    "status": "hadir",
    "time": "07:30",
    "photo": "JD",
    "attendance": 95,
    "late": 2,
    "absent": 1,
    "permission": 0,
    "type": "existing",
    "promotionStatus": "naik",
    "nextClass": "XI-IPA-1",
    "violations": 0,
    "achievements": 2,
    "recentViolations": [],
    "recentAchievements": [
      {
        "id": 1,
        "date": "2025-10-05",
        "type": "Akademik",
        "description": "Peringkat 1 ujian matematika",
        "points": 10
      }
    ]
  }
}
```

### Remove Student
**DELETE** `/api/students/{id}`

Removes a student from the system.

#### Response
```json
{
  "success": true,
  "message": "Student successfully removed"
}
```

### Update Student Class
**PUT** `/api/students/class`

Updates a student's current class.

#### Request Body
```json
{
  "studentId": 1,
  "class": "XI-IPA-1"
}
```

#### Response
```json
{
  "success": true,
  "message": "Student class updated successfully"
}
```

### Update Student Promotion Status
**PUT** `/api/students/promotion`

Updates a student's promotion or graduation status.

#### Request Body
```json
{
  "studentId": 1,
  "promotionStatus": "naik", // "naik", "tinggal", "lulus", "belum-ditetapkan"
  "nextClass": "XI-IPA-1" // Optional
}
```

#### Response
```json
{
  "success": true,
  "message": "Student promotion status updated successfully"
}
```

---

## Attendance API

### Get Attendance Records
**GET** `/api/attendance`

Retrieves attendance records with optional filtering.

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| date | string | Filter by date (YYYY-MM-DD) |
| class | string | Filter by class |
| search | string | Search by name or NIS |

#### Response
```json
{
  "success": true,
  "date": "2025-12-13",
  "records": [
    {
      "id": 1,
      "nis": "12345",
      "name": "John Doe",
      "class": "X-IPA-1",
      "status": "hadir",
      "time": "07:30",
      "photo": "JD",
      "attendance": 95
    }
  ],
  "stats": {
    "totalStudents": 30,
    "present": 25,
    "absent": 2,
    "late": 3,
    "permission": 0,
    "attendanceRate": 93.3
  }
}
```

### Update Attendance Status
**PUT** `/api/attendance`

Updates the attendance status for a student.

#### Request Body
```json
{
  "studentId": 1,
  "newStatus": "hadir" // "hadir", "terlambat", "tidak-hadir", "izin", "sakit"
}
```

#### Response
```json
{
  "success": true,
  "message": "Attendance status updated successfully",
  "student": {
    "id": 1,
    "nis": "12345",
    "name": "John Doe",
    "class": "X-IPA-1",
    "status": "hadir",
    "time": "07:30",
    "photo": "JD",
    "attendance": 95,
    "late": 2,
    "absent": 1,
    "permission": 0
  },
  "stats": {
    "totalStudents": 30,
    "present": 25,
    "absent": 2,
    "late": 3,
    "permission": 0,
    "attendanceRate": 93.3
  },
  "categories": {
    "totalStudents": 30,
    "newStudents": 5,
    "transferStudents": 2,
    "existingStudents": 23
  }
}
```

---

## Reports API

### Generate Reports
**GET** `/api/reports`

Generates various types of reports.

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Report type ("summary", "performance", "detailed", "class", "promotion", "attendance") |
| period | string | Report period ("daily", "weekly", "monthly") |

#### Response Examples

##### Summary Report
```json
{
  "success": true,
  "reportType": "summary",
  "attendanceStats": {
    "totalStudents": 30,
    "present": 25,
    "absent": 2,
    "late": 3,
    "permission": 0,
    "attendanceRate": 93.3
  },
  "studentCategories": {
    "totalStudents": 30,
    "newStudents": 5,
    "transferStudents": 2,
    "existingStudents": 23
  }
}
```

##### Detailed Report
```json
{
  "success": true,
  "reportType": "detailed",
  "students": [
    {
      "id": 1,
      "nis": "12345",
      "name": "John Doe",
      "class": "X-IPA-1",
      "present": 25,
      "late": 2,
      "absent": 1,
      "permission": 0,
      "totalAttendanceDays": 28,
      "attendance": 95,
      "currentStatus": "hadir",
      "promotionStatus": "naik",
      "nextClass": "XI-IPA-1",
      "currentTime": "07:30"
    }
  ],
  "attendanceStats": {
    "totalStudents": 30,
    "present": 25,
    "absent": 2,
    "late": 3,
    "permission": 0,
    "attendanceRate": 93.3
  }
}
```

### Export Reports
**POST** `/api/reports`

Exports reports in PDF or Excel format.

#### Request Body
```json
{
  "format": "pdf", // "pdf" or "excel"
  "reportType": "summary",
  "data": {
    // Report data to export
  }
}
```

#### Response
Binary file data for download.

---

## Settings API

### Get Settings
**GET** `/api/settings`

Retrieves system settings.

#### Response
```json
{
  "school_name": "SMAN 1 Jakarta",
  "academic_year": "2025/2026",
  "semester": "Ganjil",
  "start_time": "07:00",
  "end_time": "15:00",
  "theme": "light",
  "notifications": true
}
```

### Update Settings
**PUT** `/api/settings`

Updates system settings.

#### Request Body
```json
{
  "school_name": "SMAN 1 Jakarta",
  "academic_year": "2025/2026",
  "semester": "Ganjil",
  "start_time": "07:00",
  "end_time": "15:00",
  "theme": "dark",
  "notifications": true
}
```

#### Response
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": {
    "school_name": "SMAN 1 Jakarta",
    "academic_year": "2025/2026",
    "semester": "Ganjil",
    "start_time": "07:00",
    "end_time": "15:00",
    "theme": "dark",
    "notifications": true
  }
}
```

---

## Teachers API

### Get All Teachers
**GET** `/api/teachers`

Retrieves all teachers.

#### Response
```json
{
  "success": true,
  "teachers": [
    {
      "id": 1,
      "name": "Budi Santoso",
      "subject": "Matematika",
      "photo": "BS"
    }
  ]
}
```

### Add New Teacher
**POST** `/api/teachers`

Adds a new teacher to the system.

#### Request Body
```json
{
  "name": "Budi Santoso",
  "subject": "Matematika"
}
```

#### Response
```json
{
  "success": true,
  "teacher": {
    "id": 1,
    "name": "Budi Santoso",
    "subject": "Matematika",
    "photo": "BS",
    "schedule": []
  }
}
```

### Get Teacher by ID
**GET** `/api/teachers/{id}`

Retrieves detailed information about a specific teacher.

#### Response
```json
{
  "success": true,
  "teacher": {
    "id": 1,
    "name": "Budi Santoso",
    "subject": "Matematika",
    "photo": "BS"
  }
}
```

### Remove Teacher
**DELETE** `/api/teachers/{id}`

Removes a teacher from the system.

#### Response
```json
{
  "success": true,
  "message": "Teacher with ID 1 successfully removed"
}
```

### Get Teacher Schedule
**GET** `/api/teachers/{id}/schedule`

Retrieves a teacher's schedule.

#### Response
```json
{
  "success": true,
  "schedule": [
    {
      "id": 1,
      "day": "Senin",
      "startTime": "07:00",
      "endTime": "08:00",
      "class": "X-IPA-1",
      "room": "Ruang 101",
      "description": "Bab 1 Aljabar"
    }
  ]
}
```

### Update Teacher Schedule
**PUT** `/api/teachers/{id}/schedule`

Updates a teacher's schedule.

#### Request Body
```json
[
  {
    "id": 1,
    "day": "Senin",
    "startTime": "07:00",
    "endTime": "08:00",
    "class": "X-IPA-1",
    "room": "Ruang 101",
    "description": "Bab 1 Aljabar"
  }
]
```

#### Response
```json
{
  "success": true,
  "teacher": {
    "id": 1,
    "name": "Budi Santoso",
    "subject": "Matematika",
    "photo": "BS",
    "schedule": [
      {
        "id": 1,
        "day": "Senin",
        "startTime": "07:00",
        "endTime": "08:00",
        "class": "X-IPA-1",
        "room": "Ruang 101",
        "description": "Bab 1 Aljabar"
      }
    ]
  }
}
```

---

## Health Check API

### Check System Status
**GET** `/api/health-check`

Checks the database connection and system status.

#### Response
```json
{
  "success": true,
  "message": "Database connection successful",
  "connected": true,
  "readyState": {
    "code": 1,
    "label": "connected"
  },
  "connection": {
    "host": "cluster0.ndikkxq.mongodb.net",
    "port": 27017,
    "name": "noahdb",
    "models": 3,
    "collections": 3
  },
  "stats": {
    "ok": true
  },
  "timestamp": "2025-12-13T10:30:00.000Z"
}
```

---

## Integration Test API

### Verify Integration
**GET** `/api/integration-test`

Verifies that all APIs are properly connected to the SIMAKA system.

#### Response
```json
{
  "success": true,
  "message": "All APIs are properly connected to SIMAKA system",
  "timestamp": "2025-12-13T10:30:00.000Z",
  "endpoints": {
    "students": "/api/students",
    "attendance": "/api/attendance",
    "reports": "/api/reports",
    "settings": "/api/settings",
    "teachers": "/api/teachers"
  }
}
```