const fs = require('fs');
const path = require('path');
const MP3Cutter = require('mp3-cutter');

const publicDir = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\public';
const outputDir = path.join(publicDir, 'marija_cortados');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Lithuanian timestamps (start and end in seconds)
const ltTimestamps = [
    { start: 0, end: 12 },
    { start: 12, end: 26 },
    { start: 26, end: 40 },
    { start: 40, end: 54 },
    { start: 54, end: 65 },
    { start: 65, end: 75 },
    { start: 75, end: 84 },
    { start: 84, end: 96 },
    { start: 96, end: 105 },
    { start: 105, end: 114 }
];

// Spanish timestamps
const esTimestamps = [
    { start: 0, end: 11 },
    { start: 11, end: 24 },
    { start: 24, end: 38 },
    { start: 38, end: 51 },
    { start: 51, end: 62 },
    { start: 62, end: 71 },
    { start: 71, end: 80 },
    { start: 80, end: 92 },
    { start: 92, end: 101 },
    { start: 101, end: 110 }
];

console.log('Splitting Lithuanian voiceover...');
const ltSource = path.join(publicDir, 'voiceover_marija_lt.mp3');
ltTimestamps.forEach((t, index) => {
    const targetFile = path.join(outputDir, `marija_lt_slide_${index + 1}.mp3`);
    MP3Cutter.cut({
        src: ltSource,
        target: targetFile,
        start: t.start,
        end: t.end
    });
    console.log(`Created: ${targetFile} (${t.start}s - ${t.end}s)`);
});

console.log('Splitting Spanish voiceover...');
const esSource = path.join(publicDir, 'voiceover_marija.mp3');
esTimestamps.forEach((t, index) => {
    const targetFile = path.join(outputDir, `marija_es_slide_${index + 1}.mp3`);
    MP3Cutter.cut({
        src: esSource,
        target: targetFile,
        start: t.start,
        end: t.end
    });
    console.log(`Created: ${targetFile} (${t.start}s - ${t.end}s)`);
});

console.log('Done!');
