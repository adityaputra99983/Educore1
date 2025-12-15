// Debug script to see what's available in pdfMake
async function debugPdfMake() {
  try {
    // Dynamically import pdfMake and vfs_fonts on the server side with type-safe handling
    // @ts-ignore
    const pdfMakeModule = await import('pdfmake/build/pdfmake.js');
    // @ts-ignore
    const vfsModule = await import('pdfmake/build/vfs_fonts.js');
    
    const pdfMake = 'default' in pdfMakeModule ? pdfMakeModule.default : pdfMakeModule;
    const vfsFonts = 'default' in vfsModule ? vfsModule.default : vfsModule;
    
    // Configure vfs safely
    // @ts-ignore - pdfmake types are inconsistent across versions
    pdfMake.vfs = vfsFonts.pdfMake?.vfs || vfsFonts.vfs || vfsFonts;
    
    console.log('pdfMake keys:', Object.keys(pdfMake));
    console.log('pdfMake typeof:', typeof pdfMake);
    console.log('pdfMake.createPdf exists:', typeof pdfMake.createPdf);
    console.log('pdfMake.createPdfKitDocument exists:', typeof pdfMake.createPdfKitDocument);
    console.log('vfsFonts keys:', Object.keys(vfsFonts));
    
    // Try to see if PdfPrinter is available in a different way
    try {
      const PdfPrinterModule = await import('pdfmake/src/printer.js');
      console.log('PdfPrinterModule keys:', Object.keys(PdfPrinterModule));
      console.log('PdfPrinterModule default keys:', Object.keys(PdfPrinterModule.default));
    } catch (err) {
      console.log('Could not import PdfPrinterModule:', err.message);
    }
    
  } catch (error) {
    console.error('Failed to initialize pdfMake:', error);
  }
}

// Run the debug
debugPdfMake().catch(console.error);