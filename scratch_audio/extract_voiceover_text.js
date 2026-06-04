const fs = require('fs');
const path = require('path');

const pageFile = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\backup-presentation-marija\\page.tsx';
const content = fs.readFileSync(pageFile, 'utf8');

// Find all double-quoted, single-quoted, or backtick strings that contain Lithuanian characters
// typical Lithuanian characters: š, ė, ų, ū, ž, ą, č, į
const regex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
let match;
const results = [];
while ((match = regex.exec(content)) !== null) {
    const str = match[0];
    if (/[šėųūžąčį]/.test(str) && str.length > 50) {
        results.push(str);
    }
}

console.log(`Found ${results.length} long strings with Lithuanian characters:`);
results.forEach((res, i) => {
    console.log(`\n--- STRING ${i + 1} (length ${res.length}) ---`);
    console.log(res.slice(0, 300) + (res.length > 300 ? '...' : ''));
});
