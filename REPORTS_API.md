# Laporan API Documentation

## Overview
The reports API provides various types of attendance reports for the school management system. It supports different report types and export formats.

## API Endpoints

### GET /api/reports
Fetch attendance reports with different types and filters.

#### Query Parameters
- `type` (string, required): Type of report to generate
  - `summary`: Attendance summary statistics
  - `performance`: Student performance data
  - `detailed`: Detailed attendance report with historical data
  - `class`: Class-wise attendance report
  - `promotion`: Promotion status report
- `period` (string, optional): Report period
  - `daily` (default)
  - `weekly`
  - `monthly`
- `class` (string, optional): Filter by class (e.g., "X-IPA-1")

#### Response Examples

##### Summary Report
```json
{
  "attendanceStats": {
    "present": 285,
    "late": 12,
    "absent": 15,
    "permission": 8,
    "attendanceRate": 89.1
  },
  "studentCategories": {
    "totalStudents": 320,
    "newStudents": 25,
    "transferStudents": 8,
    "existingStudents": 287
  },
  "topPerformers": [
    {
      "id": 7,
      "nis": "2024007",
      "name": "Galih Pratama",
      "class": "XII-IPA-1",
      "attendance": 99,
      "late": 0,
      "absent": 0,
      "permission": 1,
      "type": "existing"
    }
  ],
  "classDistribution": [
    {
      "class": "X-IPA-1",
      "present": 2,
      "late": 1,
      "absent": 0,
      "permission": 0
    }
  ]
}
```

##### Detailed Report
```json
{
  "reportTitle": "Laporan Kehadiran Siswa",
  "generatedAt": "2025-11-08T10:30:00.000Z",
  "period": "Mingguan",
  "totalStudents": 320,
  "attendanceRate": 89.1,
  "detailedStats": [
    {
      "id": 1,
      "nis": "2024001",
      "name": "Ahmad Fauzi",
      "class": "XII-IPA-1",
      "currentStatus": "hadir",
      "currentTime": "07:15",
      "attendancePercentage": 95,
      "weeklyHistory": [
        {
          "date": "2025-11-01",
          "status": "hadir",
          "time": "07:10"
        }
      ],
      "monthlySummary": {
        "present": 23,
        "late": 2,
        "absent": 1,
        "permission": 2
      }
    }
  ]
}
```

##### Class Report
```json
{
  "reportTitle": "Laporan Kehadiran per Kelas",
  "generatedAt": "2025-11-08T10:30:00.000Z",
  "classReports": [
    {
      "class": "X-IPA-1",
      "totalStudents": 30,
      "present": 28,
      "late": 1,
      "absent": 0,
      "permission": 1,
      "averageAttendance": 96.7
    }
  ]
}
```

### POST /api/reports
Export reports in various formats.

#### Request Body
```json
{
  "format": "excel", // or "pdf"
  "reportType": "summary", // or "performance", "detailed", "class", "promotion"
  "data": {} // Optional report data
}
```

#### Response
```json
{
  "success": true,
  "message": "Laporan berhasil diekspor dalam format excel",
  "format": "excel",
  "content": "NIS,Nama,Kelas,Status Saat Ini,Status Kenaikan,Kelas Tujuan,Waktu,Tingkat Kehadiran\n2024001,Ahmad Fauzi,XII-IPA-1,hadir,lulus,XII-IPA-1,07:15,95%",
  "filename": "laporan-detailed-2025-11-08.csv"
}
```

## Usage in Frontend

### Fetching Reports
```typescript
import { getReports } from '@/utils/api';

// Get summary report
const summaryReport = await getReports('summary');

// Get detailed report for a specific class
const detailedReport = await getReports('detailed', { class: 'X-IPA-1' });

// Get class-wise report
const classReport = await getReports('class');

// Get promotion report
const promotionReport = await getReports('promotion');
```

### Exporting Reports
```typescript
import { exportReport } from '@/utils/api';

// Export summary report to Excel (now exports as CSV)
await exportReport('excel', 'summary', summaryReportData);

// Export detailed report to PDF (now uses browser print functionality)
await exportReport('pdf', 'detailed', detailedReportData);
```

## Supported Export Formats

### PDF
- Uses browser's built-in print functionality
- File extension: `.pdf`
- Contains structured representation of report data
- Can be opened with any PDF reader

### Excel (CSV)
- File extension: `.csv`
- Data organized in a spreadsheet-friendly format
- Compatible with Microsoft Excel and other spreadsheet applications

## Report Types

### Summary Report
Includes:
- Attendance statistics (total students, present, late, absent, permission, attendance rate)
- Student categories (new, transfer, existing students)
- Promotion statistics (promoted, retained, graduated, undecided)
- Top performers (based on attendance rate)

### Performance Report
Includes:
- Overall attendance statistics
- Individual student data with attendance rates
- Chart representations of data

### Detailed Report
Includes:
- Comprehensive information about each student
- Weekly attendance history
- Monthly summaries
- Promotion status

### Class Report
Includes:
- Attendance statistics for each class
- Student count per class
- Distribution of attendance statuses
- Promotion statistics per class

### Promotion Report
Includes:
- Overall promotion statistics
- Promotion status per class
- Student count in each category

## Error Handling

The export functionality includes error handling for:
- Invalid parameters
- Unsupported formats
- File generation errors
- Network issues

If an error occurs, the system will return an appropriate error message to help users understand the issue.