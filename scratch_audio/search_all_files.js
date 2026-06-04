const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (f !== 'node_modules' && f !== '.git' && f !== '.next') {
                walkDir(dirPath, callback);
            }
        } else {
            callback(dirPath);
        }
    });
}

const query = 'kiekvieną minutę';
const query2 = 'svarbi kiekviena';

walkDir(baseDir, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.md') || filePath.endsWith('.json') || filePath.endsWith('.txt') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(query) || content.includes(query2)) {
            console.log(`Found in: ${filePath}`);
            // print lines
            const lines = content.split('\n');
            lines.forEach((l, idx) => {
                if (l.includes(query) || l.includes(query2)) {
                    console.log(`Line ${idx + 1}: ${l.trim().slice(0, 200)}`);
                }
            });
        }
    }
});
