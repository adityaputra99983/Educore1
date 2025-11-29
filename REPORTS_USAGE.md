# How to Use the Reports Feature

## Accessing Reports

1. Start the NOAH application by running `npm run dev` in the project root directory
2. Open your browser and navigate to `http://localhost:3000/reports`
3. The reports page will load with the default "Summary" report

## Report Types

The reports page offers several types of reports:

1. **Ringkasan Kehadiran (Summary)** - Shows overall attendance statistics
2. **Laporan per Kelas (Class Report)** - Shows attendance statistics by class
3. **Laporan Kenaikan Kelas (Promotion Report)** - Shows student promotion statistics
4. **Detail Laporan (Detailed Report)** - Shows detailed attendance information for each student
5. **Statistik Performa (Performance Statistics)** - Shows performance analysis of attendance

## Using the Reports

1. Select a report type from the "Jenis Laporan" dropdown
2. Choose a period (daily, weekly, monthly) from the "Periode" dropdown
3. Click the "Hasilkan Laporan" button to generate the report
4. View the results in the charts and tables below
5. Export the report using the "Ekspor PDF" or "Ekspor Excel" buttons

## API Endpoints

The reports page connects to the following API endpoints:

- `GET /api/reports?type=summary` - Get summary report
- `GET /api/reports?type=class` - Get class report
- `GET /api/reports?type=promotion` - Get promotion report
- `GET /api/reports?type=detailed` - Get detailed report
- `GET /api/reports?type=performance` - Get performance statistics

## Testing

To test the reports functionality, you can run:

```bash
node test-reports-page-functionality.js
```

This will verify that the API endpoints are working correctly and that data can be retrieved.