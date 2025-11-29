// Test PDF generation using the correct approach from the reports API
async function testPdfGeneration() {
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
    
    console.log('pdfMake module loaded successfully');
    
  } catch (error) {
    console.error('Failed to initialize pdfMake:', error);
    return;
  }

  try {
    // Test document definition - simpler version without custom fonts
    const docDefinition = {
      content: [
        'Test PDF Document',
        'This is a test PDF generated using pdfmake.'
      ]
    };

    // Create PDF and return as buffer using the correct method for server-side
    const pdfBuffer = await new Promise((resolve, reject) => {
      try {
        // Use the proper method for server-side PDF generation
        // In pdfmake v0.2.x, we need to use the PdfPrinter from the printer module
        const PdfPrinter = require('pdfmake/src/printer.js');
        const printer = new PdfPrinter(pdfMake.vfs);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        
        const chunks = [];
        pdfDoc.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        pdfDoc.on('end', () => {
          const result = Buffer.concat(chunks);
          resolve(result);
        });
        
        pdfDoc.on('error', (error) => {
          reject(new Error(`PDF generation error: ${error.message}`));
        });
        
        pdfDoc.end();
      } catch (error) {
        if (error && error.message) {
          reject(new Error(`Failed to create PDF: ${error.message}`));
        } else {
          reject(new Error(`Failed to create PDF: ${String(error)}`));
        }
      }
    });
    
    console.log('PDF generated successfully. Size:', pdfBuffer.length, 'bytes');
    return pdfBuffer;
    
  } catch (error) {
    console.error('Failed to create PDF:', error);
    throw error;
  }
}

// Run the test
testPdfGeneration().catch(console.error);