const fs = require('fs');

const pageFile = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\backup-presentation-marija\\page.tsx';
const content = fs.readFileSync(pageFile, 'utf8');

// Find all matches for "minute" or "odontologij" or "marija" case-insensitive
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('minute') || line.toLowerCase().includes('odontolog') || line.toLowerCase().includes('marija')) {
        console.log(`Line ${idx + 1}: ${line.trim().slice(0, 150)}`);
    }
});
