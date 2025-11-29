// Test the complete fixed reports API approach
async function testFixedReportsApi() {
  let pdfMake = null;
  let vfsFonts = null;

  try {
    // Dynamically import pdfMake and vfs_fonts on the server side
    const pdfMakeModule = await import('pdfmake/build/pdfmake.js');
    const vfsModule = await import('pdfmake/build/vfs_fonts.js');
    
    pdfMake = pdfMakeModule.default || pdfMakeModule;
    vfsFonts = vfsModule.default || vfsModule;
    
    // Configure vfs
    if (pdfMake && vfsFonts) {
      pdfMake.vfs = vfsFonts.default || vfsFonts;
    }
    
    console.log('pdfMake initialized successfully');
    
  } catch (error) {
    console.error('Failed to initialize pdfMake:', error);
    return;
  }

  try {
    // Define standard fonts (built into PDFKit)
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };
    
    // Sample data to mimic a report
    const sampleData = {
      attendanceStats: {
        totalStudents: 150,
        present: 142,
        late: 5,
        absent: 2,
        permission: 1,
        attendanceRate: 97.3
      },
      studentCategories: {
        totalStudents: 150,
        newStudents: 25,
        transferStudents: 15,
        existingStudents: 110
      },
      promotionStats: {
        totalStudents: 150,
        promoted: 120,
        retained: 20,
        graduated: 10,
        undecided: 0
      },
      topPerformers: [
        { nis: '12345', name: 'Ahmad Surya', class: 'XII-IPA-1', attendance: 100 },
        { nis: '12346', name: 'Budi Santoso', class: 'XII-IPA-2', attendance: 99.5 },
        { nis: '12347', name: 'Citra Dewi', class: 'XII-IPS-1', attendance: 99.2 }
      ]
    };
    
    // Function to generate PDF content body (simplified version)
    function generatePDFContentBody() {
      return [
        { text: 'Statistik Kehadiran', style: 'subheader', font: 'Helvetica' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Total Siswa', style: 'tableHeader', font: 'Helvetica' },
                { text: 'Hadir', style: 'tableHeader', font: 'Helvetica' },
                { text: 'Terlambat', style: 'tableHeader', font: 'Helvetica' },
                { text: 'Tidak Hadir', style: 'tableHeader', font: 'Helvetica' },
                { text: 'Izin/Sakit', style: 'tableHeader', font: 'Helvetica' },
                { text: 'Tingkat Kehadiran', style: 'tableHeader', font: 'Helvetica' }
              ],
              [
                { text: sampleData.attendanceStats.totalStudents.toString(), font: 'Helvetica' },
                { text: sampleData.attendanceStats.present.toString(), font: 'Helvetica' },
                { text: sampleData.attendanceStats.late.toString(), font: 'Helvetica' },
                { text: sampleData.attendanceStats.absent.toString(), font: 'Helvetica' },
                { text: sampleData.attendanceStats.permission.toString(), font: 'Helvetica' },
                { text: `${sampleData.attendanceStats.attendanceRate}%`, font: 'Helvetica' }
              ]
            ]
          },
          style: 'tableExample',
          font: 'Helvetica'
        },
        { text: '\n' },
        { text: 'Siswa Terbaik', style: 'subheader', font: 'Helvetica' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'NIS', style: 'tableHeader', font: 'Helvetica' },
                { text: 'Nama', style: 'tableHeader', font: 'Helvetica' },
                { text: 'Kelas', style: 'tableHeader', font: 'Helvetica' },
                { text: 'Tingkat Kehadiran', style: 'tableHeader', font: 'Helvetica' }
              ],
              ...sampleData.topPerformers.map((student) => [
                { text: student.nis.toString(), font: 'Helvetica' },
                { text: student.name, font: 'Helvetica' },
                { text: student.class, font: 'Helvetica' },
                { text: `${student.attendance}%`, font: 'Helvetica' }
              ])
            ]
          },
          style: 'tableExample',
          font: 'Helvetica'
        }
      ];
    }
    
    const docDefinition = {
      content: [
        { text: 'Laporan Ringkasan Kehadiran', style: 'header', font: 'Helvetica' },
        { text: `Generated at: ${new Date().toLocaleString('id-ID')}`, style: 'subheader', font: 'Helvetica' },
        { text: '\n' },
        ...generatePDFContentBody()
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          font: 'Helvetica'
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
          font: 'Helvetica'
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          font: 'Helvetica'
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          font: 'Helvetica'
        }
      }
    };

    // Use the proper method for server-side PDF generation
    // For pdfmake v0.2.x, we need to use PdfPrinter for server-side generation
    const PdfPrinter = require('pdfmake/src/printer.js');
    const printer = new PdfPrinter(fonts, pdfMake.vfs);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    const chunks = [];
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      console.log('PDF generated successfully using complete fixed approach. Size:', result.length, 'bytes');
    });
    
    pdfDoc.on('error', (error) => {
      console.error('PDF generation error:', error);
    });
    
    pdfDoc.end();
    
  } catch (error) {
    console.error('Failed to create PDF:', error);
  }
}

// Run the test
testFixedReportsApi().catch(console.error);