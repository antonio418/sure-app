const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\anton_mn7up\\.gemini\\antigravity\\brain\\6a3272c7-32a0-433f-88f2-0fce5f538bed\\.system_generated\\tasks\\task-79.log';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  // Split by line feed
  const lines = content.split('\n');
  
  console.log(`=== FILTERED LOG (Total raw lines: ${lines.length}) ===`);
  
  lines.forEach((line, index) => {
    // If the line contains countdowns, let's clean it up
    if (line.includes('Próximo envío en:')) {
      // Find the last countdown or just omit the progress part
      const cleanLine = line.replace(/⏳ Próximo envío en: \x1b\[36m\d\d:\d\d\x1b\[0m\.\.\. \(Presiona Ctrl\+C para abortar\)/g, '');
      if (cleanLine.trim().length > 0) {
        console.log(`${index + 1}: [Cleaned] ${cleanLine.trim().substring(0, 200)}`);
      }
    } else {
      console.log(`${index + 1}: ${line}`);
    }
  });
} catch (err) {
  console.error("Error reading log:", err);
}
