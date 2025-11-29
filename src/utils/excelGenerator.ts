'use client';

/**
 * Generate an Excel report using xlsx with modern styling
 * @param reportData The report data to include in the Excel file
 * @param reportType The type of report (summary, detailed, etc.)
 * @returns Promise<Blob> A promise that resolves to the Excel file blob
 */
export async function generateExcelReport(reportData: any, reportType: string): Promise<Blob> {
  try {
    // Dynamically import xlsx to avoid SSR issues
    const xlsxModule = await import('xlsx');
    const XLSX = xlsxModule.default || xlsxModule;
    
    // Create workbook with better styling
    const wb = XLSX.utils.book_new();
    
    // Add metadata to workbook
    wb.Props = {
      Title: "Laporan Kehadiran dan Kenaikan Kelas",
      Subject: "Laporan Resmi",
      Author: "Sistem Monitoring Sekolah",
      CreatedDate: new Date()
    };
    
    // Add worksheets based on report type with enhanced formatting
    switch (reportType) {
      case 'summary':
        addSummaryWorksheet(wb, reportData, XLSX);
        break;
      case 'detailed':
        addDetailedWorksheet(wb, reportData, XLSX);
        break;
      case 'class':
        addClassWorksheet(wb, reportData, XLSX);
        break;
      case 'promotion':
        addPromotionWorksheet(wb, reportData, XLSX);
        break;
      case 'performance':
        addPerformanceWorksheet(wb, reportData, XLSX);
        break;
      default:
        addGenericWorksheet(wb, reportData, reportType, XLSX);
    }
    
    // Generate and return as blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  } catch (error) {
    console.error('Error generating Excel:', error);
    throw new Error(`Failed to generate Excel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function addSummaryWorksheet(wb: any, reportData: any, XLSX: any) {
  // Create summary data with better formatting and styling
  const summaryData = [
    ['LAPORAN RESMI'],
    ['SISTEM MONITORING KEHADIRAN DAN KENAIKAN KELAS'],
    [new Date().toLocaleDateString('id-ID')],
    [], // Empty row
  ];
  
  // Add attendance statistics with card-like design
  summaryData.push(['STATISTIK KEHADIRAN SISWA']);
  
  // Add card-like headers for attendance stats
  summaryData.push(['HADIR', 'TERLAMBAT', 'TIDAK HADIR', 'IZIN/SAKIT']);
  
  const totalStudents = reportData.attendanceStats?.totalStudents || 0;
  const present = reportData.attendanceStats?.present || 0;
  const late = reportData.attendanceStats?.late || 0;
  const absent = reportData.attendanceStats?.absent || 0;
  const permission = reportData.attendanceStats?.permission || 0;
  const attendanceRate = reportData.attendanceStats?.attendanceRate || 0;
  
  // Add card values
  summaryData.push([
    present, 
    late, 
    absent, 
    permission
  ]);
  
  // Add percentages
  summaryData.push([
    totalStudents ? `${((present/totalStudents)*100).toFixed(1)}%` : '0%',
    totalStudents ? `${((late/totalStudents)*100).toFixed(1)}%` : '0%',
    totalStudents ? `${((absent/totalStudents)*100).toFixed(1)}%` : '0%',
    totalStudents ? `${((permission/totalStudents)*100).toFixed(1)}%` : '0%'
  ]);
  
  // Add overall attendance rate
  summaryData.push([]);
  summaryData.push([`Tingkat Kehadiran Keseluruhan: ${attendanceRate}%`]);
  
  // Add empty row for separation
  summaryData.push([]);
  
  // Add promotion stats with card-like design if available
  if (reportData.promotionStats) {
    summaryData.push(['STATUS KENAIKAN KELAS SISWA']);
    
    // Add card-like headers for promotion stats
    summaryData.push(['NAIK KELAS', 'TINGGAL KELAS', 'LULUS', 'BELUM DITENTUKAN']);
    
    const promoted = reportData.promotionStats.promoted || 0;
    const retained = reportData.promotionStats.retained || 0;
    const graduated = reportData.promotionStats.graduated || 0;
    const undecided = reportData.promotionStats.undecided || 0;
    
    const totalPromotion = promoted + retained + graduated + undecided;
    
    // Add card values
    summaryData.push([
      promoted,
      retained,
      graduated,
      undecided
    ]);
    
    // Add percentages
    summaryData.push([
      totalPromotion ? `${((promoted/totalPromotion)*100).toFixed(1)}%` : '0%',
      totalPromotion ? `${((retained/totalPromotion)*100).toFixed(1)}%` : '0%',
      totalPromotion ? `${((graduated/totalPromotion)*100).toFixed(1)}%` : '0%',
      totalPromotion ? `${((undecided/totalPromotion)*100).toFixed(1)}%` : '0%'
    ]);
    
    // Add empty row for separation
    summaryData.push([]);
  }
  
  // Add detailed attendance statistics table
  summaryData.push(['DETAIL STATISTIK KEHADIRAN']);
  summaryData.push(['Kategori', 'Jumlah', 'Persentase']);
  
  summaryData.push(['Total Siswa', totalStudents, '100%']);
  summaryData.push(['Hadir', present, totalStudents ? `${((present/totalStudents)*100).toFixed(2)}%` : '0%']);
  summaryData.push(['Terlambat', late, totalStudents ? `${((late/totalStudents)*100).toFixed(2)}%` : '0%']);
  summaryData.push(['Tidak Hadir', absent, totalStudents ? `${((absent/totalStudents)*100).toFixed(2)}%` : '0%']);
  summaryData.push(['Izin/Sakit', permission, totalStudents ? `${((permission/totalStudents)*100).toFixed(2)}%` : '0%']);
  summaryData.push(['Tingkat Kehadiran', '', `${attendanceRate}%`]);
  
  // Add empty row for separation
  summaryData.push([]);
  
  // Add detailed promotion stats if available
  if (reportData.promotionStats) {
    const promoted = reportData.promotionStats.promoted || 0;
    const retained = reportData.promotionStats.retained || 0;
    const graduated = reportData.promotionStats.graduated || 0;
    const undecided = reportData.promotionStats.undecided || 0;
    const totalPromotion = promoted + retained + graduated + undecided;
    
    summaryData.push(['DETAIL STATISTIK KENAIKAN KELAS']);
    summaryData.push(['Kategori', 'Jumlah', 'Persentase']);
    
    summaryData.push(['Naik Kelas', promoted, totalPromotion ? `${((promoted/totalPromotion)*100).toFixed(2)}%` : '0%']);
    summaryData.push(['Tinggal Kelas', retained, totalPromotion ? `${((retained/totalPromotion)*100).toFixed(2)}%` : '0%']);
    summaryData.push(['Lulus', graduated, totalPromotion ? `${((graduated/totalPromotion)*100).toFixed(2)}%` : '0%']);
    summaryData.push(['Belum Ditentukan', undecided, totalPromotion ? `${((undecided/totalPromotion)*100).toFixed(2)}%` : '0%']);
  }
  
  const ws = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Style the title rows
  if (ws['A1']) {
    ws['A1'].s = { 
      font: { sz: 18, bold: true, color: { rgb: "FF1E40AF" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for title
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
  }
  
  if (ws['A2']) {
    ws['A2'].s = { 
      font: { sz: 16, bold: true, color: { rgb: "FF3B82F6" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for subtitle
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 3 } });
  }
  
  if (ws['A3']) {
    ws['A3'].s = { 
      font: { sz: 11, italic: true, color: { rgb: "FF64748B" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for date
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 3 } });
  }
  
  // Style the card headers
  const attendanceCardHeaderRow = summaryData.findIndex(row => row[0] === 'HADIR' && row.length === 4);
  if (attendanceCardHeaderRow >= 0) {
    // Style each card header with appropriate colors
    const colors = ["FF10B981", "FFF59E0B", "FFEF4444", "FF3B82F6"];
    for (let i = 0; i < 4; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: attendanceCardHeaderRow, c: i });
      if (ws[cellRef]) {
        ws[cellRef].s = { 
          font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
          fill: { fgColor: { rgb: colors[i] } },
          alignment: { horizontal: "center" }
        };
      }
    }
  }
  
  // Style the card values
  const attendanceCardValueRow = attendanceCardHeaderRow + 1;
  if (attendanceCardValueRow >= 0) {
    for (let i = 0; i < 4; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: attendanceCardValueRow, c: i });
      if (ws[cellRef]) {
        ws[cellRef].s = { 
          font: { sz: 14, bold: true },
          alignment: { horizontal: "center" }
        };
      }
    }
  }
  
  // Style the card percentages
  const attendanceCardPercentRow = attendanceCardHeaderRow + 2;
  if (attendanceCardPercentRow >= 0) {
    const colors = ["FF10B981", "FFF59E0B", "FFEF4444", "FF3B82F6"];
    for (let i = 0; i < 4; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: attendanceCardPercentRow, c: i });
      if (ws[cellRef]) {
        ws[cellRef].s = { 
          font: { sz: 9, color: { rgb: colors[i] } },
          alignment: { horizontal: "center" }
        };
      }
    }
  }
  
  // Style the overall attendance rate
  const overallAttendanceRow = summaryData.findIndex(row => row[0] && row[0].includes('Tingkat Kehadiran Keseluruhan'));
  if (overallAttendanceRow >= 0) {
    const cellRef = XLSX.utils.encode_cell({ r: overallAttendanceRow, c: 0 });
    if (ws[cellRef]) {
      ws[cellRef].s = { 
        font: { sz: 12, bold: true, color: { rgb: "FF1E40AF" } },
        alignment: { horizontal: "left" }
      };
      // Merge cells
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({ s: { r: overallAttendanceRow, c: 0 }, e: { r: overallAttendanceRow, c: 3 } });
    }
  }
  
  // Style promotion card headers if available
  if (reportData.promotionStats) {
    const promotionCardHeaderRow = summaryData.findIndex(row => row[0] === 'NAIK KELAS' && row.length === 4);
    if (promotionCardHeaderRow >= 0) {
      // Style each card header with appropriate colors
      const colors = ["FF10B981", "FFEF4444", "FF3B82F6", "FF64748B"];
      for (let i = 0; i < 4; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: promotionCardHeaderRow, c: i });
        if (ws[cellRef]) {
          ws[cellRef].s = { 
            font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
            fill: { fgColor: { rgb: colors[i] } },
            alignment: { horizontal: "center" }
          };
        }
      }
    }
    
    // Style the card values
    const promotionCardValueRow = promotionCardHeaderRow + 1;
    if (promotionCardValueRow >= 0) {
      for (let i = 0; i < 4; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: promotionCardValueRow, c: i });
        if (ws[cellRef]) {
          ws[cellRef].s = { 
            font: { sz: 14, bold: true },
            alignment: { horizontal: "center" }
          };
        }
      }
    }
    
    // Style the card percentages
    const promotionCardPercentRow = promotionCardHeaderRow + 2;
    if (promotionCardPercentRow >= 0) {
      const colors = ["FF10B981", "FFEF4444", "FF3B82F6", "FF64748B"];
      for (let i = 0; i < 4; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: promotionCardPercentRow, c: i });
        if (ws[cellRef]) {
          ws[cellRef].s = { 
            font: { sz: 9, color: { rgb: colors[i] } },
            alignment: { horizontal: "center" }
          };
        }
      }
    }
  }
  
  // Style the detailed statistics headers
  const attendanceDetailHeaderRow = summaryData.findIndex(row => row[0] === 'Kategori' && row[1] === 'Jumlah' && row[2] === 'Persentase');
  if (attendanceDetailHeaderRow >= 0) {
    // Find the row before this which should be the section header
    const sectionHeaderRow = attendanceDetailHeaderRow - 1;
    if (sectionHeaderRow >= 0 && ws[`A${sectionHeaderRow + 1}`]) {
      ws[`A${sectionHeaderRow + 1}`].s = { 
        font: { sz: 12, bold: true, color: { rgb: "FF1E40AF" } },
        alignment: { horizontal: "left" }
      };
      // Merge cells for section header
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({ s: { r: sectionHeaderRow, c: 0 }, e: { r: sectionHeaderRow, c: 2 } });
    }
    
    // Style the table header
    for (let i = 0; i < 3; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: attendanceDetailHeaderRow, c: i });
      if (ws[cellRef]) {
        ws[cellRef].s = { 
          font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
          fill: { fgColor: { rgb: "FF2563EB" } },
          alignment: { horizontal: "center" }
        };
      }
    }
  }
  
  // Style promotion detail headers if available
  if (reportData.promotionStats) {
    const promotionDetailHeaderRow = summaryData.findIndex(
      (row, index) => 
        index > attendanceDetailHeaderRow && 
        row[0] === 'Kategori' && 
        row[1] === 'Jumlah' && 
        row[2] === 'Persentase'
    );
    
    if (promotionDetailHeaderRow >= 0) {
      // Find the row before this which should be the section header
      const sectionHeaderRow = promotionDetailHeaderRow - 1;
      if (sectionHeaderRow >= 0 && ws[`A${sectionHeaderRow + 1}`]) {
        ws[`A${sectionHeaderRow + 1}`].s = { 
          font: { sz: 12, bold: true, color: { rgb: "FF1E40AF" } },
          alignment: { horizontal: "left" }
        };
        // Merge cells for section header
        if (!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push({ s: { r: sectionHeaderRow, c: 0 }, e: { r: sectionHeaderRow, c: 2 } });
      }
      
      // Style the table header
      for (let i = 0; i < 3; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: promotionDetailHeaderRow, c: i });
        if (ws[cellRef]) {
          ws[cellRef].s = { 
            font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
            fill: { fgColor: { rgb: "FF2563EB" } },
            alignment: { horizontal: "center" }
          };
        }
      }
    }
  }
  
  // Auto-adjust column widths
  const colWidths = [
    { wch: 25 }, // Kategori
    { wch: 15 }, // Jumlah
    { wch: 15 }, // Persentase
    { wch: 15 }  // Additional column for card layout
  ];
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, 'Ringkasan');
}

function addDetailedWorksheet(wb: any, reportData: any, XLSX: any) {
  // Create header row with better formatting to match the UI exactly
  const headers = [
    'NIS',
    'NAMA SISWA',
    'KELAS',
    'HADIR',
    'TERLAMBAT',
    'TIDAK HADIR',
    'IZIN/SAKIT',
    'TINGKAT KEHADIRAN (%)',
    'STATUS KENAIKAN'
  ];
  
  // Create data rows with calculations to match the UI exactly
  const dataRows = reportData.students?.map((student: any) => [
    student.nis || '',
    student.name || '',
    student.class || '',
    student.present || 0,
    student.late || 0,
    student.absent || 0,
    student.permission || 0,
    student.attendance || 0,
    getPromotionStatusText(student.promotionStatus)
  ]) || [];
  
  // Combine headers and data with title section
  const worksheetData = [
    ['LAPORAN RESMI'],
    ['DETAIL LAPORAN SISWA'],
    [new Date().toLocaleDateString('id-ID')],
    [], // Empty row
    headers,
    ...dataRows
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Style the title rows
  if (ws['A1']) {
    ws['A1'].s = { 
      font: { sz: 16, bold: true, color: { rgb: "FF2563EB" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for title
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];
  }
  
  if (ws['A2']) {
    ws['A2'].s = { 
      font: { sz: 14, bold: true },
      alignment: { horizontal: "center" }
    };
    // Merge cells for subtitle
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 8 } });
  }
  
  if (ws['A3']) {
    ws['A3'].s = { 
      font: { sz: 10, italic: true },
      alignment: { horizontal: "center" }
    };
    // Merge cells for date
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 8 } });
  }
  
  // Style the header row
  for (let i = 0; i < headers.length; i++) {
    const cellRef = XLSX.utils.encode_cell({ r: 4, c: i });
    if (!ws[cellRef]) continue;
    ws[cellRef].s = { 
      font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
      fill: { fgColor: { rgb: "FF2563EB" } },
      alignment: { horizontal: "center" }
    };
  }
  
  // Auto-adjust column widths
  const colWidths = [
    { wch: 12 }, // NIS
    { wch: 25 }, // Nama Siswa
    { wch: 12 }, // Kelas
    { wch: 8 },  // Hadir
    { wch: 12 }, // Terlambat
    { wch: 12 }, // Tidak Hadir
    { wch: 12 }, // Izin/Sakit
    { wch: 20 }, // Tingkat Kehadiran
    { wch: 18 }  // Status Kenaikan
  ];
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, 'Detail Siswa');
}

function addClassWorksheet(wb: any, reportData: any, XLSX: any) {
  // Create header row with better formatting to match the UI exactly
  const headers = [
    'KELAS',
    'JUMLAH SISWA',
    'HADIR',
    'TERLAMBAT',
    'TIDAK HADIR',
    'IZIN/SAKIT',
    'TINGKAT KEHADIRAN (%)',
    'NAIK KELAS',
    'TINGGAL KELAS',
    'LULUS'
  ];
  
  // Create data rows to match the UI exactly
  const dataRows = reportData.classReports?.map((classReport: any) => [
    classReport.class || '',
    classReport.totalStudents || 0,
    classReport.present || 0,
    classReport.late || 0,
    classReport.absent || 0,
    classReport.permission || 0,
    classReport.averageAttendance || 0,
    classReport.promoted || 0,
    classReport.retained || 0,
    classReport.graduated || 0
  ]) || [];
  
  // Combine headers and data with title section
  const worksheetData = [
    ['LAPORAN RESMI'],
    ['LAPORAN PER KELAS'],
    [new Date().toLocaleDateString('id-ID')],
    [], // Empty row
    headers,
    ...dataRows
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Style the title rows
  if (ws['A1']) {
    ws['A1'].s = { 
      font: { sz: 16, bold: true, color: { rgb: "FF2563EB" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for title
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }];
  }
  
  if (ws['A2']) {
    ws['A2'].s = { 
      font: { sz: 14, bold: true },
      alignment: { horizontal: "center" }
    };
    // Merge cells for subtitle
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 9 } });
  }
  
  if (ws['A3']) {
    ws['A3'].s = { 
      font: { sz: 10, italic: true },
      alignment: { horizontal: "center" }
    };
    // Merge cells for date
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 9 } });
  }
  
  // Style the header row
  for (let i = 0; i < headers.length; i++) {
    const cellRef = XLSX.utils.encode_cell({ r: 4, c: i });
    if (!ws[cellRef]) continue;
    ws[cellRef].s = { 
      font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
      fill: { fgColor: { rgb: "FF2563EB" } },
      alignment: { horizontal: "center" }
    };
  }
  
  // Auto-adjust column widths
  const colWidths = [
    { wch: 12 }, // Kelas
    { wch: 15 }, // Jumlah Siswa
    { wch: 8 },  // Hadir
    { wch: 12 }, // Terlambat
    { wch: 12 }, // Tidak Hadir
    { wch: 12 }, // Izin/Sakit
    { wch: 20 }, // Tingkat Kehadiran
    { wch: 12 }, // Naik Kelas
    { wch: 12 }, // Tinggal Kelas
    { wch: 8 }   // Lulus
  ];
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan per Kelas');
}

function addPromotionWorksheet(wb: any, reportData: any, XLSX: any) {
  // Create promotion stats data with enhanced formatting
  const promotionData = [
    ['LAPORAN RESMI'],
    ['LAPORAN KENAIKAN KELAS'],
    [new Date().toLocaleDateString('id-ID')],
    [], // Empty row
    ['STATISTIK KENAIKAN KELAS'],
    ['Kategori', 'Jumlah'],
    ['Naik Kelas', reportData.promotionStats?.promoted || 0],
    ['Tinggal Kelas', reportData.promotionStats?.retained || 0],
    ['Lulus', reportData.promotionStats?.graduated || 0],
    ['Belum Ditentukan', reportData.promotionStats?.undecided || 0]
  ];
  
  const ws1 = XLSX.utils.aoa_to_sheet(promotionData);
  
  // Style the title rows
  if (ws1['A1']) {
    ws1['A1'].s = { 
      font: { sz: 16, bold: true, color: { rgb: "FF2563EB" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for title
    ws1['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  }
  
  if (ws1['A2']) {
    ws1['A2'].s = { 
      font: { sz: 14, bold: true },
      alignment: { horizontal: "center" }
    };
    // Merge cells for subtitle
    if (!ws1['!merges']) ws1['!merges'] = [];
    ws1['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 1 } });
  }
  
  if (ws1['A3']) {
    ws1['A3'].s = { 
      font: { sz: 10, italic: true },
      alignment: { horizontal: "center" }
    };
    // Merge cells for date
    if (!ws1['!merges']) ws1['!merges'] = [];
    ws1['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 1 } });
  }
  
  // Style the header rows
  const headerRow = promotionData.findIndex(row => row[0] === 'STATISTIK KENAIKAN KELAS');
  if (headerRow >= 0) {
    if (ws1[`A${headerRow + 1}`]) {
      ws1[`A${headerRow + 1}`].s = { 
        font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
        fill: { fgColor: { rgb: "FF2563EB" } },
        alignment: { horizontal: "center" }
      };
      // Merge cells for section header
      if (!ws1['!merges']) ws1['!merges'] = [];
      ws1['!merges'].push({ s: { r: headerRow, c: 0 }, e: { r: headerRow, c: 1 } });
    }
    
    if (ws1[`A${headerRow + 2}`]) {
      ws1[`A${headerRow + 2}`].s = { 
        font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
        fill: { fgColor: { rgb: "FF3B82F6" } },
        alignment: { horizontal: "center" }
      };
    }
  }
  
  // Auto-adjust column widths
  const colWidths1 = [
    { wch: 25 }, // Kategori
    { wch: 15 }  // Jumlah
  ];
  ws1['!cols'] = colWidths1;
  
  XLSX.utils.book_append_sheet(wb, ws1, 'Statistik Kenaikan');
  
  // Add detailed student stats if available
  if (reportData.detailedStats && reportData.detailedStats.length > 0) {
    // Create header row to match the UI exactly
    const headers = [
      'NIS',
      'NAMA SISWA',
      'KELAS',
      'STATUS SAAT INI',
      'STATUS KENAIKAN',
      'KELAS TUJUAN',
      'WAKTU',
      'TINGKAT KEHADIRAN (%)'
    ];
    
    // Create data rows to match the UI exactly
    const dataRows = reportData.detailedStats.map((student: any) => [
      student.nis || '',
      student.name || '',
      student.class || '',
      getCurrentStatusText(student.currentStatus),
      getPromotionStatusText(student.promotionStatus),
      student.nextClass || '-',
      student.currentTime || '-',
      student.attendancePercentage || 0
    ]);
    
    // Combine headers and data with title section
    const worksheetData = [
      ['LAPORAN RESMI'],
      ['DETAIL STATISTIK SISWA'],
      [new Date().toLocaleDateString('id-ID')],
      [], // Empty row
      headers,
      ...dataRows
    ];
    
    const ws2 = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Style the title rows
    if (ws2['A1']) {
      ws2['A1'].s = { 
        font: { sz: 16, bold: true, color: { rgb: "FF2563EB" } },
        alignment: { horizontal: "center" }
      };
      // Merge cells for title
      ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];
    }
    
    if (ws2['A2']) {
      ws2['A2'].s = { 
        font: { sz: 14, bold: true },
        alignment: { horizontal: "center" }
      };
      // Merge cells for subtitle
      if (!ws2['!merges']) ws2['!merges'] = [];
      ws2['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 7 } });
    }
    
    if (ws2['A3']) {
      ws2['A3'].s = { 
        font: { sz: 10, italic: true },
        alignment: { horizontal: "center" }
      };
      // Merge cells for date
      if (!ws2['!merges']) ws2['!merges'] = [];
      ws2['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 7 } });
    }
    
    // Style the header row
    for (let i = 0; i < headers.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 4, c: i });
      if (!ws2[cellRef]) continue;
      ws2[cellRef].s = { 
        font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
        fill: { fgColor: { rgb: "FF2563EB" } },
        alignment: { horizontal: "center" }
      };
    }
    
    // Auto-adjust column widths
    const colWidths2 = [
      { wch: 12 }, // NIS
      { wch: 25 }, // Nama Siswa
      { wch: 12 }, // Kelas
      { wch: 15 }, // Status Saat Ini
      { wch: 18 }, // Status Kenaikan
      { wch: 15 }, // Kelas Tujuan
      { wch: 12 }, // Waktu
      { wch: 20 }  // Tingkat Kehadiran
    ];
    ws2['!cols'] = colWidths2;
    
    XLSX.utils.book_append_sheet(wb, ws2, 'Detail Statistik');
  }
}

function addGenericWorksheet(wb: any, reportData: any, reportType: string, XLSX: any) {
  // Create generic data with enhanced formatting
  const genericData = [
    ['LAPORAN RESMI'],
    [`LAPORAN ${reportType.toUpperCase()}`],
    [new Date().toLocaleDateString('id-ID')],
    [], // Empty row
  ];
  
  // Try to add whatever data is available
  if (reportData.students && reportData.students.length > 0) {
    genericData.push(['DATA SISWA']);
    genericData.push(['NIS', 'Nama', 'Kelas']); // Simple headers
    
    // Add all students
    reportData.students.forEach((student: any) => {
      genericData.push([
        student.nis || '',
        student.name || '',
        student.class || ''
      ]);
    });
  } else {
    genericData.push(['Tidak ada data tersedia']);
  }
  
  const ws = XLSX.utils.aoa_to_sheet(genericData);
  
  // Style the title rows
  if (ws['A1']) {
    ws['A1'].s = { 
      font: { sz: 16, bold: true, color: { rgb: "FF2563EB" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for title
    const lastCol = reportData.students && reportData.students.length > 0 ? 2 : 0;
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } }];
  }
  
  if (genericData.length > 3 && ws['A4']) {
    ws['A4'].s = { 
      font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
      fill: { fgColor: { rgb: "FF2563EB" } },
      alignment: { horizontal: "center" }
    };
  }
  
  // Auto-adjust column widths
  const colWidths = [
    { wch: 15 }, // NIS
    { wch: 30 }, // Nama
    { wch: 15 }  // Kelas
  ];
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
}

function addPerformanceWorksheet(wb: any, reportData: any, XLSX: any) {
  // Create performance data with better formatting and styling
  const performanceData = [
    ['LAPORAN RESMI'],
    ['STATISTIK PERFORMA KEHADIRAN'],
    [new Date().toLocaleDateString('id-ID')],
    [], // Empty row
  ];
  
  // Add performance statistics with card-like design
  performanceData.push(['KATEGORI KEHADIRAN SISWA']);
  
  // Add card-like headers for performance stats
  performanceData.push(['KEHADIRAN SEMPURNA', 'KEHADIRAN TINGGI', 'KEHADIRAN SEDANG', 'KEHADIRAN RENDAH']);
  
  const perfectAttendance = reportData.performanceData?.perfectAttendance || 0;
  const highAttendance = reportData.performanceData?.highAttendance || 0;
  const mediumAttendance = reportData.performanceData?.mediumAttendance || 0;
  const lowAttendance = reportData.performanceData?.lowAttendance || 0;
  
  // Add card values
  performanceData.push([
    perfectAttendance, 
    highAttendance, 
    mediumAttendance, 
    lowAttendance
  ]);
  
  // Add empty row for separation
  performanceData.push([]);
  
  // Add most late students
  if (reportData.performanceData?.mostLate && reportData.performanceData.mostLate.length > 0) {
    performanceData.push(['SISWA TERLAMBAT TERBANYAK']);
    performanceData.push(['NIS', 'Nama', 'Kelas', 'Jumlah Terlambat']);
    
    reportData.performanceData.mostLate.forEach((student: any) => {
      performanceData.push([
        student.nis || '',
        student.name || '',
        student.class || '',
        student.late || 0
      ]);
    });
    
    // Add empty row for separation
    performanceData.push([]);
  }
  
  // Add most absent students
  if (reportData.performanceData?.mostAbsent && reportData.performanceData.mostAbsent.length > 0) {
    performanceData.push(['SISWA TIDAK HADIR TERBANYAK']);
    performanceData.push(['NIS', 'Nama', 'Kelas', 'Jumlah Tidak Hadir']);
    
    reportData.performanceData.mostAbsent.forEach((student: any) => {
      performanceData.push([
        student.nis || '',
        student.name || '',
        student.class || '',
        student.absent || 0
      ]);
    });
    
    // Add empty row for separation
    performanceData.push([]);
  }
  
  // Add attendance stats if available
  if (reportData.attendanceStats) {
    const totalStudents = reportData.attendanceStats.totalStudents || 0;
    const present = reportData.attendanceStats.present || 0;
    const late = reportData.attendanceStats.late || 0;
    const absent = reportData.attendanceStats.absent || 0;
    const permission = reportData.attendanceStats.permission || 0;
    const attendanceRate = reportData.attendanceStats.attendanceRate || 0;
    
    performanceData.push(['STATISTIK KEHADIRAN']);
    performanceData.push(['Kategori', 'Jumlah', 'Persentase']);
    
    performanceData.push(['Total Siswa', totalStudents, '100%']);
    performanceData.push(['Hadir', present, totalStudents ? `${((present/totalStudents)*100).toFixed(2)}%` : '0%']);
    performanceData.push(['Terlambat', late, totalStudents ? `${((late/totalStudents)*100).toFixed(2)}%` : '0%']);
    performanceData.push(['Tidak Hadir', absent, totalStudents ? `${((absent/totalStudents)*100).toFixed(2)}%` : '0%']);
    performanceData.push(['Izin/Sakit', permission, totalStudents ? `${((permission/totalStudents)*100).toFixed(2)}%` : '0%']);
    performanceData.push(['Tingkat Kehadiran', '', `${attendanceRate}%`]);
  }
  
  const ws = XLSX.utils.aoa_to_sheet(performanceData);
  
  // Style the title rows
  if (ws['A1']) {
    ws['A1'].s = { 
      font: { sz: 18, bold: true, color: { rgb: "FF1E40AF" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for title
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
  }
  
  if (ws['A2']) {
    ws['A2'].s = { 
      font: { sz: 16, bold: true, color: { rgb: "FF3B82F6" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for subtitle
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 3 } });
  }
  
  if (ws['A3']) {
    ws['A3'].s = { 
      font: { sz: 11, italic: true, color: { rgb: "FF64748B" } },
      alignment: { horizontal: "center" }
    };
    // Merge cells for date
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 3 } });
  }
  
  // Style the card headers
  const performanceCardHeaderRow = performanceData.findIndex(row => row[0] === 'KEHADIRAN SEMPURNA' && row.length === 4);
  if (performanceCardHeaderRow >= 0) {
    // Style each card header with appropriate colors
    const colors = ["FF10B981", "FF3B82F6", "FFF59E0B", "FFEF4444"];
    for (let i = 0; i < 4; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: performanceCardHeaderRow, c: i });
      if (ws[cellRef]) {
        ws[cellRef].s = { 
          font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
          fill: { fgColor: { rgb: colors[i] } },
          alignment: { horizontal: "center" }
        };
      }
    }
  }
  
  // Style the card values
  const performanceCardValueRow = performanceCardHeaderRow + 1;
  if (performanceCardValueRow >= 0) {
    for (let i = 0; i < 4; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: performanceCardValueRow, c: i });
      if (ws[cellRef]) {
        ws[cellRef].s = { 
          font: { sz: 14, bold: true },
          alignment: { horizontal: "center" }
        };
      }
    }
  }
  
  // Style section headers
  const sectionHeaders = [
    'KATEGORI KEHADIRAN SISWA',
    'SISWA TERLAMBAT TERBANYAK',
    'SISWA TIDAK HADIR TERBANYAK',
    'STATISTIK KEHADIRAN'
  ];
  
  sectionHeaders.forEach(headerText => {
    const headerRow = performanceData.findIndex(row => row[0] === headerText);
    if (headerRow >= 0) {
      const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: 0 });
      if (ws[cellRef]) {
        ws[cellRef].s = { 
          font: { sz: 12, bold: true, color: { rgb: "FF1E40AF" } },
          alignment: { horizontal: "left" }
        };
        // Merge cells for section header
        if (!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push({ s: { r: headerRow, c: 0 }, e: { r: headerRow, c: 3 } });
      }
    }
  });
  
  // Style table headers
  const tableHeaders = [
    ['NIS', 'Nama', 'Kelas', 'Jumlah Terlambat'],
    ['NIS', 'Nama', 'Kelas', 'Jumlah Tidak Hadir'],
    ['Kategori', 'Jumlah', 'Persentase']
  ];
  
  tableHeaders.forEach(headerRowData => {
    const headerRow = performanceData.findIndex(row => 
      row.length === headerRowData.length && 
      row.every((val, i) => val === headerRowData[i])
    );
    
    if (headerRow >= 0) {
      for (let i = 0; i < headerRowData.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: i });
        if (ws[cellRef]) {
          ws[cellRef].s = { 
            font: { bold: true, color: { rgb: "FFFFFFFF" } }, 
            fill: { fgColor: { rgb: "FF2563EB" } },
            alignment: { horizontal: "center" }
          };
        }
      }
    }
  });
  
  // Auto-adjust column widths
  const colWidths = [
    { wch: 15 }, // NIS
    { wch: 30 }, // Nama
    { wch: 15 }, // Kelas
    { wch: 20 }  // Jumlah
  ];
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, 'Statistik Performa');
}

function getPromotionStatusText(status: string): string {
  switch (status) {
    case 'naik': return 'Naik';
    case 'tinggal': return 'Tinggal';
    case 'lulus': return 'Lulus';
    case 'belum-ditetapkan': return 'Belum Ditentukan';
    default: return status || '-';
  }
}

function getCurrentStatusText(status: string): string {
  switch (status) {
    case 'hadir': return 'Hadir';
    case 'terlambat': return 'Terlambat';
    case 'tidak-hadir': return 'Tidak Hadir';
    case 'izin': return 'Izin';
    case 'sakit': return 'Sakit';
    default: return status || '-';
  }
}