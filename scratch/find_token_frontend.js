const fs = require('fs');
const path = require('path');

function searchDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        searchDirectory(fullPath);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('/api/validate-token')) {
          console.log(`Found '/api/validate-token' in: ${fullPath}`);
          // Print lines
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.includes('/api/validate-token')) {
              console.log(`  Line ${index + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
}

searchDirectory(path.join(__dirname, '..', 'src'));
