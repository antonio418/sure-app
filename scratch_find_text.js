const fs = require('fs');
const path = require('path');

function searchInDir(dir, pattern, recursive = true) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        continue; // skip files we can't stat
      }
      
      if (stat.isDirectory()) {
        if (recursive && file !== 'node_modules' && file !== '.git' && file !== '.next' && file !== 'AppData' && file !== 'AppDataLocal' && file !== 'Program Files') {
          searchInDir(fullPath, pattern, recursive);
        }
      } else {
        if (file.endsWith('.md') || file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.txt') || file.endsWith('.json') || file.endsWith('.html')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.toLowerCase().includes(pattern.toLowerCase())) {
              console.log(`Found in: ${fullPath}`);
              const lines = content.split('\n');
              lines.forEach((line, i) => {
                if (line.toLowerCase().includes(pattern.toLowerCase())) {
                  console.log(`  Line ${i+1}: ${line.trim()}`);
                }
              });
            }
          } catch (e) {}
        }
      }
    }
  } catch (e) {}
}

console.log("Searching in Downloads (shallow)...");
searchInDir('C:\\Users\\anton_mn7up\\Downloads', 'audita de forma cruzada', false);
searchInDir('C:\\Users\\anton_mn7up\\Downloads', 'analista cansado', false);

console.log("Searching in IADIRECTO...");
searchInDir('C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO', 'audita de forma cruzada', true);
searchInDir('C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO', 'analista cansado', true);

console.log("Searching in artifacts directory...");
searchInDir('C:\\Users\\anton_mn7up\\.gemini\\antigravity\\brain\\c6267ba0-9f59-4958-aa8d-d39883485819', 'audita de forma cruzada', true);
searchInDir('C:\\Users\\anton_mn7up\\.gemini\\antigravity\\brain\\c6267ba0-9f59-4958-aa8d-d39883485819', 'analista cansado', true);

console.log("Search completed.");
