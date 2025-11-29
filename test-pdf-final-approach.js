// Final test using the correct approach for pdfmake v0.2.x server-side generation
async function testPdfGeneration() {
  try {
    // Import the PdfPrinter directly
    const PdfPrinter = require('pdfmake/src/printer.js');
    
    // Define standard fonts only (no vfs needed for standard fonts)
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
        { text: 'Test PDF Document', style: 'header' },
        { text: 'This is a test PDF generated using pdfmake with standard fonts only.', style: 'subheader' }
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
        }
      }
    };

    // Create printer with fonts only (no vfs for standard fonts)
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    const chunks = [];
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      console.log('PDF generated successfully with standard fonts only. Size:', result.length, 'bytes');
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
testPdfGeneration().catch(console.error);