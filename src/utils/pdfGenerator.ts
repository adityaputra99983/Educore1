'use client';

import type { Student } from '../types/student';

// Safe conversion functions to handle NaN, null, or infinite values
function safeToString(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) return '0';
  return String(value);
}

function safeToNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return 0;
  return num;
}

function safeText(value: any): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) return '0';
  return String(value);
}

/**
 * Generate a PDF report using pdfmake with modern styling
 * @param reportData The report data to include in the PDF
 * @param reportType The type of report (summary, detailed, etc.)
 * @returns Promise<Blob> A promise that resolves to the PDF blob
 */
export async function generatePDFReport(reportData: any, reportType: string): Promise<Blob> {
  try {
    // Dynamically import pdfmake to avoid SSR issues
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    
    const pdfMake = pdfMakeModule.default;
    pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    
    // Define the document structure based on report type with enhanced styling
    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 80, 40, 60],
      content: [],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 10],
          color: '#1e40af'
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'white',
          fillColor: '#2563eb',
          alignment: 'center'
        },
        tableCell: {
          fontSize: 9
        },
        title: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 5],
          color: '#1e40af'
        },
        subtitle: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
          color: '#3b82f6'
        },
        date: {
          fontSize: 10,
          alignment: 'right',
          margin: [0, 0, 0, 20]
        },
        footer: {
          fontSize: 8,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        schoolName: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 2],
          color: '#1e3a8a'
        },
        schoolAddress: {
          fontSize: 11,
          alignment: 'center',
          margin: [0, 0, 0, 15],
          color: '#64748b'
        },
        divider: {
          margin: [0, 10, 0, 10]
        },
        cardTitle: {
          fontSize: 12,
          bold: true,
          color: '#1e40af',
          margin: [0, 0, 0, 5]
        },
        cardValue: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 2]
        },
        cardLabel: {
          fontSize: 8,
          color: '#64748b',
          margin: [0, 0, 0, 2]
        }
      },
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10
      }
    };
    
    // Add school header with logo placeholder
    docDefinition.content.push({
      columns: [
        {
          // Logo placeholder - in a real implementation, you would add an image
          width: 60,
          text: '[LOGO]',
          alignment: 'center',
          bold: true,
          fontSize: 14,
          color: '#2563eb'
        },
        [
          {
            text: 'NAMA SEKOLAH',
            style: 'schoolName'
          },
          {
            text: 'Alamat Sekolah - Kota, Provinsi',
            style: 'schoolAddress'
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 0, y1: 0,
                x2: 515, y2: 0,
                lineWidth: 2,
                lineColor: '#2563eb'
              }
            ],
            style: 'divider'
          }
        ],
        {
          width: 60,
          text: ''
        }
      ]
    });
    
    // Add title with school information
    docDefinition.content.push({
      text: 'LAPORAN RESMI',
      style: 'title'
    });
    
    docDefinition.content.push({
      text: 'SISTEM MONITORING KEHADIRAN DAN KENAIKAN KELAS',
      style: 'subtitle'
    });
    
    // Add date and school info
    const now = new Date();
    docDefinition.content.push({
      text: `Tanggal: ${now.toLocaleDateString('id-ID')}`,
      style: 'date'
    });
    
    // Add content based on report type with enhanced formatting
    switch (reportType) {
      case 'summary':
        generateSummaryContent(docDefinition, reportData);
        break;
      case 'detailed':
        generateDetailedContent(docDefinition, reportData);
        break;
      case 'class':
        generateClassContent(docDefinition, reportData);
        break;
      case 'promotion':
        generatePromotionContent(docDefinition, reportData);
        break;
      case 'performance':
        generatePerformanceContent(docDefinition, reportData);
        break;
      default:
        generateGenericContent(docDefinition, reportData, reportType);
    }
    
    // Add footer with page numbers and document info
    docDefinition.footer = (currentPage: number, pageCount: number) => {
      return {
        columns: [
          {
            text: `Dokumen ini dicetak pada ${new Date().toLocaleDateString('id-ID')} - Sistem Monitoring Kehadiran dan Kenaikan Kelas`,
            style: 'footer',
            alignment: 'left'
          },
          {
            text: `Halaman ${currentPage} dari ${pageCount}`,
            style: 'footer',
            alignment: 'right'
          }
        ],
        margin: [40, 10, 40, 0]
      };
    };
    
    // Add document info
    docDefinition.info = {
      title: `Laporan ${reportType} - Sistem Monitoring Kehadiran`,
      author: 'Sistem Monitoring Kehadiran dan Kenaiakan Kelas',
      subject: 'Laporan Resmi Kehadiran Siswa',
      keywords: 'laporan, kehadiran, siswa, monitoring, sekolah',
    };
    
    // Return a promise that resolves to the PDF blob
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.getBlob((blob: Blob) => {
          resolve(blob);
        }, (error: any) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateSummaryContent(docDefinition: any, reportData: any) {
  // Add summary section with enhanced styling
  docDefinition.content.push({ text: 'RINGKASAN LAPORAN KEHADIRAN', style: 'subheader' });
  
  // Add some spacing
  docDefinition.content.push({ text: '', margin: [0, 0, 0, 5] });
  
  // Attendance stats with card-like design to match UI
  const totalStudents = reportData.attendanceStats?.totalStudents || 0;
  const present = reportData.attendanceStats?.present || 0;
  const late = reportData.attendanceStats?.late || 0;
  const absent = reportData.attendanceStats?.absent || 0;
  const permission = reportData.attendanceStats?.permission || 0;
  const attendanceRate = reportData.attendanceStats?.attendanceRate || 0;
  
  // Add attendance summary cards
  docDefinition.content.push({
    text: 'Statistik Kehadiran Siswa',
    style: 'cardTitle',
    margin: [0, 10, 0, 5]
  });
  
  // Create a table with card-like appearance for attendance stats
  const attendanceCards = [
    [
      { text: 'HADIR', style: 'tableHeader', fillColor: '#10b981' },
      { text: 'TERLAMBAT', style: 'tableHeader', fillColor: '#f59e0b' },
      { text: 'TIDAK HADIR', style: 'tableHeader', fillColor: '#ef4444' },
      { text: 'IZIN/SAKIT', style: 'tableHeader', fillColor: '#3b82f6' }
    ],
    [
      { text: safeText(present), style: 'cardValue', alignment: 'center' },
      { text: safeText(late), style: 'cardValue', alignment: 'center' },
      { text: safeText(absent), style: 'cardValue', alignment: 'center' },
      { text: safeText(permission), style: 'cardValue', alignment: 'center' }
    ],
    [
      { 
        text: totalStudents ? `${((present/totalStudents)*100).toFixed(1)}%` : '0%', 
        style: 'cardLabel', 
        alignment: 'center',
        color: '#10b981'
      },
      { 
        text: totalStudents ? `${((late/totalStudents)*100).toFixed(1)}%` : '0%', 
        style: 'cardLabel', 
        alignment: 'center',
        color: '#f59e0b'
      },
      { 
        text: totalStudents ? `${((absent/totalStudents)*100).toFixed(1)}%` : '0%', 
        style: 'cardLabel', 
        alignment: 'center',
        color: '#ef4444'
      },
      { 
        text: totalStudents ? `${((permission/totalStudents)*100).toFixed(1)}%` : '0%', 
        style: 'cardLabel', 
        alignment: 'center',
        color: '#3b82f6'
      }
    ]
  ];
  
  docDefinition.content.push({
    table: {
      headerRows: 1,
      widths: ['*', '*', '*', '*'],
      body: attendanceCards
    },
    layout: {
      fillColor: () => null,
      hLineWidth: () => 0,
      vLineWidth: () => 0,
    },
    margin: [0, 0, 0, 15]
  });
  
  // Add overall attendance rate
  docDefinition.content.push({
    text: `Tingkat Kehadiran Keseluruhan: ${safeText(attendanceRate)}%`,
    style: 'cardLabel',
    bold: true,
    margin: [0, 0, 0, 20]
  });
  
  // Promotion stats if available with card-like design
  const promoted = reportData.promotionStats ? reportData.promotionStats.promoted || 0 : 0;
  const retained = reportData.promotionStats ? reportData.promotionStats.retained || 0 : 0;
  const graduated = reportData.promotionStats ? reportData.promotionStats.graduated || 0 : 0;
  const undecided = reportData.promotionStats ? reportData.promotionStats.undecided || 0 : 0;
  const totalPromotion = promoted + retained + graduated + undecided;
  
  if (reportData.promotionStats) {
    docDefinition.content.push({ text: 'STATISTIK KENAIKAN KELAS', style: 'subheader' });
    
    // Add some spacing
    docDefinition.content.push({ text: '', margin: [0, 0, 0, 5] });
    
    // Add promotion summary cards
    docDefinition.content.push({
      text: 'Status Kenaikan Kelas Siswa',
      style: 'cardTitle',
      margin: [0, 10, 0, 5]
    });
    
    // Create a table with card-like appearance for promotion stats
    const promotionCards = [
      [
        { text: 'NAIK KELAS', style: 'tableHeader', fillColor: '#10b981' },
        { text: 'TINGGAL KELAS', style: 'tableHeader', fillColor: '#ef4444' },
        { text: 'LULUS', style: 'tableHeader', fillColor: '#3b82f6' },
        { text: 'BELUM DITENTUKAN', style: 'tableHeader', fillColor: '#64748b' }
      ],
      [
        { text: safeText(promoted), style: 'cardValue', alignment: 'center' },
        { text: safeText(retained), style: 'cardValue', alignment: 'center' },
        { text: safeText(graduated), style: 'cardValue', alignment: 'center' },
        { text: safeText(undecided), style: 'cardValue', alignment: 'center' }
      ],
      [
        { 
          text: totalPromotion ? `${((promoted/totalPromotion)*100).toFixed(1)}%` : '0%', 
          style: 'cardLabel', 
          alignment: 'center',
          color: '#10b981'
        },
        { 
          text: totalPromotion ? `${((retained/totalPromotion)*100).toFixed(1)}%` : '0%', 
          style: 'cardLabel', 
          alignment: 'center',
          color: '#ef4444'
        },
        { 
          text: totalPromotion ? `${((graduated/totalPromotion)*100).toFixed(1)}%` : '0%', 
          style: 'cardLabel', 
          alignment: 'center',
          color: '#3b82f6'
        },
        { 
          text: totalPromotion ? `${((undecided/totalPromotion)*100).toFixed(1)}%` : '0%', 
          style: 'cardLabel', 
          alignment: 'center',
          color: '#64748b'
        }
      ]
    ];
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*'],
        body: promotionCards
      },
      layout: {
        fillColor: () => null,
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
      margin: [0, 0, 0, 15]
    });
  }
  
  // Add detailed attendance table
  docDefinition.content.push({ text: 'DETAIL STATISTIK KEHADIRAN', style: 'subheader' });
  
  const attendanceTableBody = [
    [{ text: 'KATEGORI', style: 'tableHeader' }, { text: 'JUMLAH', style: 'tableHeader' }, { text: 'PERSENTASE', style: 'tableHeader' }],
    [{ text: 'Total Siswa', style: 'tableCell' }, { text: safeText(totalStudents), style: 'tableCell' }, { text: '100%', style: 'tableCell' }],
    [{ text: 'Hadir', style: 'tableCell' }, { text: safeText(present), style: 'tableCell' }, { text: totalStudents ? `${((present/totalStudents)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
    [{ text: 'Terlambat', style: 'tableCell' }, { text: safeText(late), style: 'tableCell' }, { text: totalStudents ? `${((late/totalStudents)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
    [{ text: 'Tidak Hadir', style: 'tableCell' }, { text: safeText(absent), style: 'tableCell' }, { text: totalStudents ? `${((absent/totalStudents)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
    [{ text: 'Izin/Sakit', style: 'tableCell' }, { text: safeText(permission), style: 'tableCell' }, { text: totalStudents ? `${((permission/totalStudents)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
    [{ text: 'Tingkat Kehadiran', style: 'tableCell' }, { text: '', style: 'tableCell' }, { text: `${safeText(attendanceRate)}%`, style: 'tableCell' }]
  ];
  
  docDefinition.content.push({
    table: {
      headerRows: 1,
      widths: ['*', '*', '*'],
      body: attendanceTableBody
    },
    layout: {
      fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2563eb' : null),
      hLineWidth: (i: number, tableNode: any) => {
        if (i === 0 || i === tableNode.table.body.length) return 2;
        return (i === 1) ? 1 : 1;
      },
      vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
      hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? '#2563eb' : '#cccccc',
      vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? '#2563eb' : '#cccccc',
    },
    margin: [0, 0, 0, 20]
  });
  
  // Add spacing
  docDefinition.content.push({ text: '', margin: [0, 10, 0, 10] });
  
  // Promotion stats table if available
  if (reportData.promotionStats) {
    docDefinition.content.push({ text: 'DETAIL STATISTIK KENAIKAN KELAS', style: 'subheader' });
    
    // Add some spacing
    docDefinition.content.push({ text: '', margin: [0, 0, 0, 5] });
    
    const promotionTableBody = [
      [{ text: 'KATEGORI', style: 'tableHeader' }, { text: 'JUMLAH', style: 'tableHeader' }, { text: 'PERSENTASE', style: 'tableHeader' }],
      [{ text: 'Naik Kelas', style: 'tableCell' }, { text: safeText(promoted), style: 'tableCell' }, { text: totalPromotion ? `${((promoted/totalPromotion)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
      [{ text: 'Tinggal Kelas', style: 'tableCell' }, { text: safeText(retained), style: 'tableCell' }, { text: totalPromotion ? `${((retained/totalPromotion)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
      [{ text: 'Lulus', style: 'tableCell' }, { text: safeText(graduated), style: 'tableCell' }, { text: totalPromotion ? `${((graduated/totalPromotion)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
      [{ text: 'Belum Ditentukan', style: 'tableCell' }, { text: safeText(undecided), style: 'tableCell' }, { text: totalPromotion ? `${((undecided/totalPromotion)*100).toFixed(2)}%` : '0%', style: 'tableCell' }]
    ];
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['*', '*', '*'],
        body: promotionTableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2563eb' : null),
        hLineWidth: (i: number, tableNode: any) => {
          if (i === 0 || i === tableNode.table.body.length) return 2;
          return (i === 1) ? 1 : 1;
        },
        vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
        hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? '#2563eb' : '#cccccc',
        vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? '#2563eb' : '#cccccc',
      }
    });
  }
}

function generateDetailedContent(docDefinition: any, reportData: any) {
  // Add detailed section with enhanced styling
  docDefinition.content.push({ text: 'DETAIL LAPORAN SISWA', style: 'subheader' });
  
  // Add some spacing
  docDefinition.content.push({ text: '', margin: [0, 0, 0, 5] });
  
  if (reportData.students && reportData.students.length > 0) {
    // Create table header to match UI exactly
    const tableBody = [
      [
        { text: 'NIS', style: 'tableHeader' },
        { text: 'NAMA SISWA', style: 'tableHeader' },
        { text: 'KELAS', style: 'tableHeader' },
        { text: 'HADIR', style: 'tableHeader' },
        { text: 'TERLAMBAT', style: 'tableHeader' },
        { text: 'TIDAK HADIR', style: 'tableHeader' },
        { text: 'IZIN/SAKIT', style: 'tableHeader' },
        { text: 'TINGKAT KEHADIRAN', style: 'tableHeader' },
        { text: 'STATUS KENAIKAN', style: 'tableHeader' }
      ]
    ];
    
    // Add student data rows to match UI exactly
    reportData.students.forEach((student: any) => {
      tableBody.push([
        { text: safeText(student.nis), style: 'tableCell' },
        { text: safeText(student.name), style: 'tableCell' },
        { text: safeText(student.class), style: 'tableCell' },
        { text: safeText(student.present), style: 'tableCell' },
        { text: safeText(student.late), style: 'tableCell' },
        { text: safeText(student.absent), style: 'tableCell' },
        { text: safeText(student.permission), style: 'tableCell' },
        { text: `${safeText(student.attendance)}%`, style: 'tableCell' },
        { text: getPromotionStatusText(student.promotionStatus), style: 'tableCell' }
      ]);
    });
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
        body: tableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2c3e50' : null),
        hLineWidth: (i: number, tableNode: any) => {
          if (i === 0 || i === tableNode.table.body.length) return 2;
          return (i === 1) ? 1 : 1;
        },
        vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
        hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? '#2c3e50' : '#cccccc',
        vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? '#2c3e50' : '#cccccc',
      }
    });
  } else {
    docDefinition.content.push({ text: 'Tidak ada data siswa tersedia', margin: [0, 10, 0, 0] });
  }
}

function generateClassContent(docDefinition: any, reportData: any) {
  // Add class section with enhanced styling
  docDefinition.content.push({ text: 'LAPORAN PER KELAS', style: 'subheader' });
  
  // Add some spacing
  docDefinition.content.push({ text: '', margin: [0, 0, 0, 5] });
  
  if (reportData.classReports && reportData.classReports.length > 0) {
    // Create table header to match UI exactly
    const tableBody = [
      [
        { text: 'KELAS', style: 'tableHeader' },
        { text: 'JUMLAH SISWA', style: 'tableHeader' },
        { text: 'HADIR', style: 'tableHeader' },
        { text: 'TERLAMBAT', style: 'tableHeader' },
        { text: 'TIDAK HADIR', style: 'tableHeader' },
        { text: 'IZIN/SAKIT', style: 'tableHeader' },
        { text: 'TINGKAT KEHADIRAN', style: 'tableHeader' },
        { text: 'NAIK KELAS', style: 'tableHeader' },
        { text: 'TINGGAL KELAS', style: 'tableHeader' },
        { text: 'LULUS', style: 'tableHeader' }
      ]
    ];
    
    // Add class data rows to match UI exactly
    reportData.classReports.forEach((classReport: any) => {
      tableBody.push([
        { text: safeText(classReport.class), style: 'tableCell' },
        { text: safeText(classReport.totalStudents), style: 'tableCell' },
        { text: safeText(classReport.present), style: 'tableCell' },
        { text: safeText(classReport.late), style: 'tableCell' },
        { text: safeText(classReport.absent), style: 'tableCell' },
        { text: safeText(classReport.permission), style: 'tableCell' },
        { text: `${safeText(classReport.averageAttendance)}%`, style: 'tableCell' },
        { text: safeText(classReport.promoted), style: 'tableCell' },
        { text: safeText(classReport.retained), style: 'tableCell' },
        { text: safeText(classReport.graduated), style: 'tableCell' }
      ]);
    });
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: tableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2c3e50' : null),
        hLineWidth: (i: number, tableNode: any) => {
          if (i === 0 || i === tableNode.table.body.length) return 2;
          return (i === 1) ? 1 : 1;
        },
        vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
        hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? '#2c3e50' : '#cccccc',
        vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? '#2c3e50' : '#cccccc',
      }
    });
  } else {
    docDefinition.content.push({ text: 'Tidak ada data kelas tersedia', margin: [0, 10, 0, 0] });
  }
}

function generatePromotionContent(docDefinition: any, reportData: any) {
  // Add promotion section with enhanced styling
  docDefinition.content.push({ text: 'LAPORAN KENAIKAN KELAS', style: 'subheader' });
  
  // Add some spacing
  docDefinition.content.push({ text: '', margin: [0, 0, 0, 5] });
  
  // Promotion stats table
  if (reportData.promotionStats) {
    const promotionTableBody = [
      [{ text: 'KATEGORI', style: 'tableHeader' }, { text: 'JUMLAH', style: 'tableHeader' }],
      [{ text: 'Naik Kelas', style: 'tableCell' }, { text: safeText(reportData.promotionStats.promoted), style: 'tableCell' }],
      [{ text: 'Tinggal Kelas', style: 'tableCell' }, { text: safeText(reportData.promotionStats.retained), style: 'tableCell' }],
      [{ text: 'Lulus', style: 'tableCell' }, { text: safeText(reportData.promotionStats.graduated), style: 'tableCell' }],
      [{ text: 'Belum Ditentukan', style: 'tableCell' }, { text: safeText(reportData.promotionStats.undecided), style: 'tableCell' }]
    ];
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['*', '*'],
        body: promotionTableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2563eb' : null),
        hLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? 2 : 1,
        vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
        hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? 'black' : '#aaa',
        vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 'black' : '#aaa',
      },
      margin: [0, 0, 0, 20]
    });
  }
  
  // Detailed student stats
  if (reportData.detailedStats && reportData.detailedStats.length > 0) {
    docDefinition.content.push({ text: 'DETAIL STATISTIK SISWA', style: 'subheader' });
    
    // Create table header to match UI exactly
    const tableBody = [
      [
        { text: 'NIS', style: 'tableHeader' },
        { text: 'NAMA SISWA', style: 'tableHeader' },
        { text: 'KELAS', style: 'tableHeader' },
        { text: 'STATUS SAAT INI', style: 'tableHeader' },
        { text: 'STATUS KENAIKAN', style: 'tableHeader' },
        { text: 'KELAS TUJUAN', style: 'tableHeader' },
        { text: 'WAKTU', style: 'tableHeader' },
        { text: 'TINGKAT KEHADIRAN', style: 'tableHeader' }
      ]
    ];
    
    // Add student data rows to match UI exactly
    reportData.detailedStats.forEach((student: any) => {
      tableBody.push([
        { text: safeText(student.nis), style: 'tableCell' },
        { text: safeText(student.name), style: 'tableCell' },
        { text: safeText(student.class), style: 'tableCell' },
        { text: getCurrentStatusText(student.currentStatus), style: 'tableCell' },
        { text: getPromotionStatusText(student.promotionStatus), style: 'tableCell' },
        { text: safeText(student.nextClass), style: 'tableCell' },
        { text: safeText(student.currentTime), style: 'tableCell' },
        { text: `${safeText(student.attendancePercentage)}%`, style: 'tableCell' }
      ]);
    });
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: tableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2c3e50' : null),
        hLineWidth: (i: number, tableNode: any) => {
          if (i === 0 || i === tableNode.table.body.length) return 2;
          return (i === 1) ? 1 : 1;
        },
        vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
        hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? '#2c3e50' : '#cccccc',
        vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? '#2c3e50' : '#cccccc',
      }
    });
  } else {
    docDefinition.content.push({ text: 'Tidak ada data statistik siswa tersedia', margin: [0, 10, 0, 0] });
  }
}

function generatePerformanceContent(docDefinition: any, reportData: any) {
  // Add performance section with enhanced styling
  docDefinition.content.push({ text: 'STATISTIK PERFORMA KEHADIRAN', style: 'subheader' });
  
  // Add some spacing
  docDefinition.content.push({ text: '', margin: [0, 0, 0, 5] });
  
  // Performance stats with card-like design to match UI
  const perfectAttendance = reportData.performanceData?.perfectAttendance || 0;
  const highAttendance = reportData.performanceData?.highAttendance || 0;
  const mediumAttendance = reportData.performanceData?.mediumAttendance || 0;
  const lowAttendance = reportData.performanceData?.lowAttendance || 0;
  
  // Add performance summary cards
  docDefinition.content.push({
    text: 'Kategori Kehadiran Siswa',
    style: 'cardTitle',
    margin: [0, 10, 0, 5]
  });
  
  // Create a table with card-like appearance for performance stats
  const performanceCards = [
    [
      { text: 'KEHADIRAN SEMPURNA', style: 'tableHeader', fillColor: '#10b981' },
      { text: 'KEHADIRAN TINGGI', style: 'tableHeader', fillColor: '#3b82f6' },
      { text: 'KEHADIRAN SEDANG', style: 'tableHeader', fillColor: '#f59e0b' },
      { text: 'KEHADIRAN RENDAH', style: 'tableHeader', fillColor: '#ef4444' }
    ],
    [
      { text: safeText(perfectAttendance), style: 'cardValue', alignment: 'center' },
      { text: safeText(highAttendance), style: 'cardValue', alignment: 'center' },
      { text: safeText(mediumAttendance), style: 'cardValue', alignment: 'center' },
      { text: safeText(lowAttendance), style: 'cardValue', alignment: 'center' }
    ]
  ];
  
  docDefinition.content.push({
    table: {
      headerRows: 1,
      widths: ['*', '*', '*', '*'],
      body: performanceCards
    },
    layout: {
      fillColor: () => null,
      hLineWidth: () => 0,
      vLineWidth: () => 0,
    },
    margin: [0, 0, 0, 15]
  });
  
  // Add most late students
  if (reportData.performanceData?.mostLate && reportData.performanceData.mostLate.length > 0) {
    docDefinition.content.push({ text: 'SISWA TERLAMBAT TERBANYAK', style: 'subheader' });
    
    const mostLateTableBody = [
      [
        { text: 'NIS', style: 'tableHeader' },
        { text: 'NAMA SISWA', style: 'tableHeader' },
        { text: 'KELAS', style: 'tableHeader' },
        { text: 'JUMLAH TERLAMBAT', style: 'tableHeader' }
      ]
    ];
    
    reportData.performanceData.mostLate.forEach((student: any) => {
      mostLateTableBody.push([
        { text: safeText(student.nis), style: 'tableCell' },
        { text: safeText(student.name), style: 'tableCell' },
        { text: safeText(student.class), style: 'tableCell' },
        { text: safeText(student.late), style: 'tableCell' }
      ]);
    });
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto'],
        body: mostLateTableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2563eb' : null),
        hLineWidth: (i: number, tableNode: any) => {
          if (i === 0 || i === tableNode.table.body.length) return 2;
          return (i === 1) ? 1 : 1;
        },
        vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
        hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? '#2563eb' : '#cccccc',
        vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? '#2563eb' : '#cccccc',
      },
      margin: [0, 0, 0, 15]
    });
  }
  
  // Add most absent students
  if (reportData.performanceData?.mostAbsent && reportData.performanceData.mostAbsent.length > 0) {
    docDefinition.content.push({ text: 'SISWA TIDAK HADIR TERBANYAK', style: 'subheader' });
    
    const mostAbsentTableBody = [
      [
        { text: 'NIS', style: 'tableHeader' },
        { text: 'NAMA SISWA', style: 'tableHeader' },
        { text: 'KELAS', style: 'tableHeader' },
        { text: 'JUMLAH TIDAK HADIR', style: 'tableHeader' }
      ]
    ];
    
    reportData.performanceData.mostAbsent.forEach((student: any) => {
      mostAbsentTableBody.push([
        { text: safeText(student.nis), style: 'tableCell' },
        { text: safeText(student.name), style: 'tableCell' },
        { text: safeText(student.class), style: 'tableCell' },
        { text: safeText(student.absent), style: 'tableCell' }
      ]);
    });
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto'],
        body: mostAbsentTableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2563eb' : null),
        hLineWidth: (i: number, tableNode: any) => {
          if (i === 0 || i === tableNode.table.body.length) return 2;
          return (i === 1) ? 1 : 1;
        },
        vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
        hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? '#2563eb' : '#cccccc',
        vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? '#2563eb' : '#cccccc',
      }
    });
  }
  
  // Add attendance stats if available
  if (reportData.attendanceStats) {
    const totalStudents = reportData.attendanceStats.totalStudents || 0;
    const present = reportData.attendanceStats.present || 0;
    const late = reportData.attendanceStats.late || 0;
    const absent = reportData.attendanceStats.absent || 0;
    const permission = reportData.attendanceStats.permission || 0;
    const attendanceRate = reportData.attendanceStats.attendanceRate || 0;
    
    // Add detailed attendance table
    docDefinition.content.push({ text: 'DETAIL STATISTIK KEHADIRAN', style: 'subheader' });
    
    const attendanceTableBody = [
      [{ text: 'KATEGORI', style: 'tableHeader' }, { text: 'JUMLAH', style: 'tableHeader' }, { text: 'PERSENTASE', style: 'tableHeader' }],
      [{ text: 'Total Siswa', style: 'tableCell' }, { text: safeText(totalStudents), style: 'tableCell' }, { text: '100%', style: 'tableCell' }],
      [{ text: 'Hadir', style: 'tableCell' }, { text: safeText(present), style: 'tableCell' }, { text: totalStudents ? `${((present/totalStudents)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
      [{ text: 'Terlambat', style: 'tableCell' }, { text: safeText(late), style: 'tableCell' }, { text: totalStudents ? `${((late/totalStudents)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
      [{ text: 'Tidak Hadir', style: 'tableCell' }, { text: safeText(absent), style: 'tableCell' }, { text: totalStudents ? `${((absent/totalStudents)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
      [{ text: 'Izin/Sakit', style: 'tableCell' }, { text: safeText(permission), style: 'tableCell' }, { text: totalStudents ? `${((permission/totalStudents)*100).toFixed(2)}%` : '0%', style: 'tableCell' }],
      [{ text: 'Tingkat Kehadiran', style: 'tableCell' }, { text: '', style: 'tableCell' }, { text: `${safeText(attendanceRate)}%`, style: 'tableCell' }]
    ];
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['*', '*', '*'],
        body: attendanceTableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2563eb' : null),
        hLineWidth: (i: number, tableNode: any) => {
          if (i === 0 || i === tableNode.table.body.length) return 2;
          return (i === 1) ? 1 : 1;
        },
        vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
        hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? '#2563eb' : '#cccccc',
        vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? '#2563eb' : '#cccccc',
      },
      margin: [0, 0, 0, 20]
    });
  }
}

function generateGenericContent(docDefinition: any, reportData: any, reportType: string) {
  // Add generic section with enhanced styling
  docDefinition.content.push({ text: `LAPORAN ${reportType.toUpperCase()}`, style: 'subheader' });
  
  // Add some spacing
  docDefinition.content.push({ text: '', margin: [0, 0, 0, 5] });
  
  // Try to display whatever data is available
  if (reportData.students && reportData.students.length > 0) {
    // Display students data if available
    const tableBody = [
      [
        { text: 'NIS', style: 'tableHeader' },
        { text: 'NAMA SISWA', style: 'tableHeader' },
        { text: 'KELAS', style: 'tableHeader' }
      ]
    ];
    
    reportData.students.slice(0, 10).forEach((student: any) => {
      tableBody.push([
        { text: safeText(student.nis), style: 'tableCell' },
        { text: safeText(student.name), style: 'tableCell' },
        { text: safeText(student.class), style: 'tableCell' }
      ]);
    });
    
    if (reportData.students.length > 10) {
      tableBody.push([{ text: '...', style: 'tableCell' }, { text: '...', style: 'tableCell' }, { text: '...', style: 'tableCell' }]);
    }
    
    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto'],
        body: tableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2c3e50' : null),
        hLineWidth: (i: number, tableNode: any) => {
          if (i === 0 || i === tableNode.table.body.length) return 2;
          return (i === 1) ? 1 : 1;
        },
        vLineWidth: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? 2 : 1,
        hLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.body.length) ? '#2c3e50' : '#cccccc',
        vLineColor: (i: number, tableNode: any) => (i === 0 || i === tableNode.table.widths.length) ? '#2c3e50' : '#cccccc',
      }
    });
  } else {
    docDefinition.content.push({ text: 'Tidak ada data tersedia untuk ditampilkan', margin: [0, 10, 0, 0] });
  }
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