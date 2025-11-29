const fs = require('fs');
const path = require('path');

// Path to the problematic file
const filePath = path.join('noah', 'src', 'app', 'api', 'reports', 'route.ts');

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Remove the extra closing brace at the end
// The error is at line 1786 which is an extra '}' 
content = content.trimEnd();
if (content.endsWith('}')) {
  // Check if this is the extra brace by looking at the end of the file
  const lines = content.split('\n');
  // If the last line is just a closing brace, remove it
  if (lines[lines.length - 1].trim() === '}' && lines[lines.length - 2].trim() === '}' && lines[lines.length - 3].trim() === '') {
    // Remove the extra closing brace and any trailing empty lines
    content = lines.slice(0, lines.length - 1).join('\n');
  }
}

// Write the fixed content back to the file
fs.writeFileSync(filePath, content);

console.log('Fixed the extra closing brace in route.ts');