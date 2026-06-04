const fs = require('fs');
const path = require('path');

const pageFile = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\backup-presentation-marija\\page.tsx';
const content = fs.readFileSync(pageFile, 'utf8');

const regex = /["'`][^"'`]*Šiuolaikinėje[^"'`]*["'`]/g;
const matches = content.match(regex);
if (matches) {
    console.log(`Found ${matches.length} matches:`);
    matches.forEach((m, idx) => {
        console.log(`Match ${idx + 1}:`);
        console.log(m.slice(0, 1000));
    });
} else {
    console.log('No matches found for "Šiuolaikinėje"');
    // Let's search for "odontologijoje svarbi" case-insensitive
    const regex2 = /odontologijoje svarbi/i;
    const match2 = content.match(regex2);
    if (match2) {
        console.log('Found "odontologijoje svarbi" at index', match2.index);
        console.log(content.slice(match2.index - 100, match2.index + 500));
    }
}
