// Test PDF generation using the correct server-side approach for pdfmake v0.2.x
async function testPdfGeneration() {
  let PdfPrinter = null;
  let vfsFonts = null;

  try {
    // For server-side PDF generation, we need to import PdfPrinter directly
    const PdfPrinterModule = await import('pdfmake/src/printer.js');
    const vfsModule = await import('pdfmake/build/vfs_fonts.js');
    
    PdfPrinter = PdfPrinterModule.default || PdfPrinterModule;
    vfsFonts = vfsModule.default || vfsModule;
    
    console.log('PdfPrinter module loaded successfully');
    
  } catch (error) {
    console.error('Failed to import PdfPrinter:', error);
    return;
  }

  try {
    // Define the fonts
    const fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    };

    // Test document definition with proper font definitions
    const docDefinition = {
      content: [
        { text: 'Test PDF Document', style: 'header' },
        { text: 'This is a test PDF generated using pdfmake.', style: 'subheader' }
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

    // Create printer with vfs and fonts
    const printer = new PdfPrinter(fonts, vfsFonts.default || vfsFonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    const chunks = [];
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      console.log('PDF generated successfully. Size:', result.length, 'bytes');
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