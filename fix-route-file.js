const fs = require('fs');
const path = require('path');

// Path to the problematic file
const filePath = path.join('noah', 'src', 'app', 'api', 'reports', 'route.ts');

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Trim any extra whitespace and ensure it ends with exactly one closing brace
content = content.trim();

// Check if it ends with multiple closing braces
if (content.endsWith('}}')) {
  // Remove one closing brace
  content = content.slice(0, -1);
}

// Ensure it ends with exactly one closing brace
if (!content.endsWith('}')) {
  content += '\n}';
}

// Write the fixed content back to the file
fs.writeFileSync(filePath, content);

console.log('File has been fixed and now properly ends with one closing brace');