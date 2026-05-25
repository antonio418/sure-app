import fs from 'fs';

const content = fs.readFileSync('src/app/intake/page.tsx', 'utf8');

let braceCount = 0;
let inDoubleQuote = false;
let inSingleQuote = false;
let inBacktick = false;
let inCommentLine = false;
let inCommentBlock = false;

let lines = content.split('\n');

for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
  const line = lines[lineIndex];
  const prevBraceCount = braceCount;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    const prevChar = line[i - 1];

    if (inCommentLine) continue;
    if (inCommentBlock) {
      if (char === '*' && nextChar === '/') {
        inCommentBlock = false;
        i++;
      }
      continue;
    }

    if (char === '/' && nextChar === '/' && !inDoubleQuote && !inSingleQuote && !inBacktick) {
      inCommentLine = true;
      i++;
      continue;
    }
    if (char === '/' && nextChar === '*' && !inDoubleQuote && !inSingleQuote && !inBacktick) {
      inCommentBlock = true;
      i++;
      continue;
    }

    if (char === '"' && prevChar !== '\\' && !inSingleQuote && !inBacktick) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }
    if (char === "'" && prevChar !== '\\' && !inDoubleQuote && !inBacktick) {
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (char === '`' && prevChar !== '\\' && !inDoubleQuote && !inSingleQuote) {
      inBacktick = !inBacktick;
      continue;
    }

    if (inDoubleQuote || inSingleQuote || inBacktick) continue;

    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
  }
  
  inCommentLine = false; // end of line comment
  
  if (braceCount !== prevBraceCount) {
     console.log(`Line ${lineIndex + 1}: ${braceCount} (Change: ${braceCount - prevBraceCount}) -> ${line.trim().substring(0, 40)}`);
  }
}
