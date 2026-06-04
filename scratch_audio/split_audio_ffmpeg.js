const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffmpegPath = 'C:\\Users\\anton_mn7up\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-essentials_build\\bin\\ffmpeg.exe';
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

function splitFile(sourceFile, timestamps, prefix) {
    timestamps.forEach((t, index) => {
        const targetFile = path.join(outputDir, `${prefix}_slide_${index + 1}.mp3`);
        // We transcode to 128k MP3 to ensure 100% clean encoding and container compatibility
        const cmd = `"${ffmpegPath}" -y -ss ${t.start} -to ${t.end} -i "${sourceFile}" -codec:a libmp3lame -b:a 128k "${targetFile}"`;
        try {
            execSync(cmd, { stdio: 'ignore' });
            console.log(`Successfully created: ${targetFile} (${t.start}s - ${t.end}s)`);
        } catch (err) {
            console.error(`Error creating ${targetFile}:`, err.message);
        }
    });
}

console.log('Splitting Lithuanian voiceover using FFmpeg...');
const ltSource = path.join(publicDir, 'voiceover_marija_lt.mp3');
splitFile(ltSource, ltTimestamps, 'marija_lt');

console.log('Splitting Spanish voiceover using FFmpeg...');
const esSource = path.join(publicDir, 'voiceover_marija.mp3');
splitFile(esSource, esTimestamps, 'marija_es');

console.log('Done splitting all audios with FFmpeg!');
