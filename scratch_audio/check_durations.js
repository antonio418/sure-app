const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpegDir = 'C:\\Users\\anton_mn7up\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-essentials_build\\bin';
const ffprobePath = path.join(ffmpegDir, 'ffprobe.exe');
const targetDir = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\public\\marija_cortados';

fs.readdirSync(targetDir).forEach(file => {
    if (file.endsWith('.mp3')) {
        const filePath = path.join(targetDir, file);
        const cmd = `"${ffprobePath}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
        const dur = execSync(cmd).toString().trim();
        console.log(`${file}: ${dur}s`);
    }
});
