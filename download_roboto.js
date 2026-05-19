const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'public', 'fonts');
const font = {
  name: 'Roboto-Regular.ttf',
  url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto-Regular.ttf'
};
// URL 404'd. Let's try the apache directory
font.url = 'https://raw.githubusercontent.com/google/fonts/main/apache/roboto/Roboto-Regular.ttf';

const downloadFont = (font) => {
  return new Promise((resolve, reject) => {
    const dest = path.join(fontsDir, font.name);
    console.log(`Downloading ${font.name}...`);
    const file = fs.createWriteStream(dest);
    https.get(font.url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${font.url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Successfully downloaded ${font.name}`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

downloadFont(font).catch(err => {
    console.log("Failed. Trying another URL...");
    font.url = 'https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-Regular.ttf';
    return downloadFont(font);
}).catch(console.error);
