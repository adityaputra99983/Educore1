// Simple test PDF generation
const PdfPrinter = require('pdfmake/src/printer.js');
const vfsFonts = require('pdfmake/build/vfs_fonts.js');

// Define the fonts
const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

// Test document definition with standard fonts only
const docDefinition = {
  content: [
    'Test PDF Document',
    'This is a test PDF generated using pdfmake.'
  ]
};

try {
  // Create printer with vfs and standard fonts
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