const fs = require('fs');
const path = require('path');

// Path to the problematic file
const filePath = path.join('noah', 'src', 'app', 'api', 'reports', 'route.ts');

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Check if the file ends properly
if (!content.trim().endsWith('}')) {
  // Add the missing closing brace
  content = content.trim() + '\n}';
  
  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content);
  
  console.log('Fixed the missing closing brace in route.ts');
} else {
  console.log('File already ends with a closing brace');
}