const fs = require('fs');

const pageFile = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\backup-presentation-marija\\page.tsx';
const content = fs.readFileSync(pageFile, 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('slideTimingsLt') || line.includes('slideTimingsEs') || line.includes('setSlideTimings')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
