// Test PDF generation using the exact same approach as the working reports API
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
  
  const docDefinition = {
    content: [
      'Test PDF Document',
      'This is a test PDF generated using pdfmake.'
    ]
  };

  // Create PDF and return as buffer using the correct method for server-side
  return new Promise((resolve, reject) => {
    try {
      // Use the proper method for server-side PDF generation
      const pdfDoc = pdfMake.createPdfKitDocument(docDefinition);
      
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
}

// Run the test
testPdfGeneration()
  .then(buffer => {
    console.log('PDF generated successfully. Size:', buffer.length, 'bytes');
  })
  .catch(error => {
    console.error('Failed to create PDF:', error);
  });