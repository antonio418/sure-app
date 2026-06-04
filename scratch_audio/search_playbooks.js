const fs = require('fs');
const path = require('path');

const files = [
    'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\Instrucciones_Presentaciones_y_Videos.md',
    'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\SURE_Master_Playbook.md',
    'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\SURE_Prompts_For_Claude.md'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.toLowerCase().includes('kiekviena') || content.toLowerCase().includes('minutė')) {
            console.log(`Found in: ${file}`);
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
                if (line.toLowerCase().includes('kiekviena') || line.toLowerCase().includes('minutė') || line.toLowerCase().includes('odontologij')) {
                    console.log(`Line ${idx + 1}: ${line.trim().slice(0, 150)}`);
                }
            });
        }
    } else {
        console.log(`Not exists: ${file}`);
    }
});
