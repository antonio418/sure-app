const fs = require('fs');
const path = require('path');

const pageFile = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\backup-presentation-marija\\page.tsx';
const content = fs.readFileSync(pageFile, 'utf8');

// Let's write a quick regex search or output key parts of the content
console.log('File length:', content.length);

// Let's look for "lt: [" or "voiceover" or look for slide arrays.
// We can search for the Lithuanian translation arrays
const matchLt = content.match(/const\s+slides\s*=\s*\[([\s\S]*?)\];/);
if (matchLt) {
    console.log('Found slides array!');
    // Let's write them to a text file for easy reading
    fs.writeFileSync('extracted_slides.txt', matchLt[0]);
    console.log('Saved extracted_slides.txt');
} else {
    // If not found, let's print some lines containing "Pristatome"
    const lines = content.split('\n');
    const matchingLines = [];
    lines.forEach((line, idx) => {
        if (line.includes('Pristatome') || line.includes('Šiuolaikinėje') || line.includes('odontologijoje')) {
            matchingLines.push(`${idx + 1}: ${line.trim()}`);
        }
    });
    console.log('Matching lines:');
    console.log(matchingLines.slice(0, 20).join('\n'));
}
