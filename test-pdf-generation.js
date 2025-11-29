const pdfMake = require('pdfmake/build/pdfmake.js');
const vfsFonts = require('pdfmake/build/vfs_fonts.js');

// Configure vfs
pdfMake.vfs = vfsFonts.default || vfsFonts;

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

// Fix: Use the correct method for server-side PDF generation
// In newer versions of pdfmake, we need to use createPdf instead of createPdfKitDocument
// and then call getBuffer() to get the PDF as a buffer
try {
  const pdfDoc = pdfMake.createPdf(docDefinition);
  
  pdfDoc.getBuffer((buffer) => {
    console.log('PDF generated successfully. Size:', buffer.length, 'bytes');
  }, (error) => {
    console.error('PDF generation error:', error);
  });
} catch (error) {
  console.error('Failed to create PDF:', error);
}