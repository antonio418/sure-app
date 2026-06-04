const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logFile = 'C:\\Users\\anton_mn7up\\.gemini\\antigravity\\brain\\c6267ba0-9f59-4958-aa8d-d39883485819\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logFile),
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    if (line.includes('Pristatome Maria DI') || line.includes('Šiuolaikinėje odontologijoje')) {
        try {
            const obj = JSON.parse(line);
            console.log('--- MATCH IN STEP', obj.step_index, 'TYPE:', obj.type);
            console.log(obj.content ? obj.content.slice(0, 1000) : 'No content');
        } catch (e) {
            console.log('Match (could not parse JSON):', line.slice(0, 500));
        }
    }
});
