// Test PDF generation using the correct API for pdfmake v0.2.x
async function initializePdfMake() {
  let pdfMake = null;
  let vfsFonts = null;
  
  try {
    // Dynamically import pdfMake and vfs_fonts on the server side with type-safe handling
    // @ts-ignore
    const pdfMakeModule = await import('pdfmake/build/pdfmake.js');
    // @ts-ignore
    const vfsModule = await import('pdfmake/build/vfs_fonts.js');
    
    pdfMake = 'default' in pdfMakeModule ? pdfMakeModule.default : pdfMakeModule;
    vfsFonts = 'default' in vfsModule ? vfsModule.default : vfsModule;
    
    // Configure vfs safely
    // @ts-ignore - pdfmake types are inconsistent across versions
    if (pdfMake && vfsFonts) {
      pdfMake.vfs = vfsFonts.pdfMake?.vfs || vfsFonts.vfs || vfsFonts;
    }
    
    return { pdfMake, vfsFonts };
  } catch (error) {
    console.error('Failed to initialize pdfMake:', error);
    throw new Error(`Failed to initialize pdfMake for PDF generation: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function testPdfGeneration() {
  // Initialize pdfMake if not already done
  const { pdfMake, vfsFonts } = await initializePdfMake();
  
  if (!pdfMake) {
    throw new Error('pdfMake not initialized');
  }
  
  // Ensure vfs is properly set with type-safe handling
  if (vfsFonts && !pdfMake.vfs) {
    // @ts-ignore - pdfmake types are inconsistent across versions
    pdfMake.vfs = vfsFonts.pdfMake?.vfs || vfsFonts.vfs || vfsFonts;
  }
  
  // Define fonts properly
  const fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  };
  
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
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  // For pdfmake v0.2.x, we need to use PdfPrinter for server-side generation
  const PdfPrinter = require('pdfmake/src/printer.js');
  const printer = new PdfPrinter(fonts, pdfMake.vfs);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  
  const chunks = [];
  pdfDoc.on('data', (chunk) => {
    chunks.push(chunk);
  });
  
  return new Promise((resolve, reject) => {
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      console.log('PDF generated successfully. Size:', result.length, 'bytes');
      resolve(result);
    });
    
    pdfDoc.on('error', (error) => {
      console.error('PDF generation error:', error);
      reject(new Error(`PDF generation error: ${error.message}`));
    });
    
    pdfDoc.end();
  });
}

// Run the test
testPdfGeneration()
  .then(buffer => {
    console.log('Success: PDF generated');
  })
  .catch(error => {
    console.error('Failed to create PDF:', error);
  });