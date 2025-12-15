// Test PDF generation using the correct server-side approach for pdfmake v0.2.x
async function testPdfGeneration() {
  let pdfMake = null;
  let vfsFonts = null;

  try {
    // Dynamically import pdfMake and vfs_fonts on the server side with type-safe handling
    const pdfMakeModule = await import('pdfmake/build/pdfmake.js');
    const vfsModule = await import('pdfmake/build/vfs_fonts.js');
    
    pdfMake = 'default' in pdfMakeModule ? pdfMakeModule.default : pdfMakeModule;
    vfsFonts = 'default' in vfsModule ? vfsModule.default : vfsModule;
    
    // Configure vfs safely
    // @ts-ignore - pdfmake types are inconsistent across versions
    if (pdfMake && vfsFonts) {
      pdfMake.vfs = vfsFonts.pdfMake?.vfs || vfsFonts.vfs || vfsFonts;
    }
    
    console.log('pdfMake module loaded successfully');
    console.log('Available methods:', Object.keys(pdfMake));
    
  } catch (error) {
    console.error('Failed to import pdfMake:', error);
    return;
  }

  try {
    // Test document definition
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

    // For pdfmake v0.2.x, we need to use PdfPrinter for server-side generation
    const PdfPrinter = pdfMake.PdfPrinter;
    if (!PdfPrinter) {
      throw new Error('PdfPrinter not available in pdfMake module');
    }
    
    const printer = new PdfPrinter(pdfMake.vfs);
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