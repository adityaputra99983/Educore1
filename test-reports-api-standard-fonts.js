// Test the fixed reports API approach with standard fonts
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
    
    const docDefinition = {
      content: [
        { text: 'Test Report', style: 'header', font: 'Helvetica' },
        { text: `Generated at: ${new Date().toLocaleString('id-ID')}`, style: 'subheader', font: 'Helvetica' },
        { text: '\n' },
        { text: 'This is a test PDF generated using the fixed approach with standard fonts.', font: 'Helvetica' }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
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
      console.log('PDF generated successfully using fixed approach with standard fonts. Size:', result.length, 'bytes');
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