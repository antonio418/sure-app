const fs = require('fs');

const pageFile = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\backup-presentation-marija\\page.tsx';
const content = fs.readFileSync(pageFile, 'utf8');

// Print lines 14 to 310
const lines = content.split('\n');
for (let i = 13; i < 310; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}
