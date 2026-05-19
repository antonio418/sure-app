const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fontsToDownload = [
  {
    name: 'Roboto-Regular.ttf',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto-Regular.ttf'
  },
  {
    name: 'NotoSansDevanagari-Regular.ttf',
    url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/unhinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf'
  },
  {
    name: 'NotoSansSC-Regular.otf',
    url: 'https://raw.githubusercontent.com/googlefonts/noto-cjk/main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf'
  }
];

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

async function main() {
  for (const font of fontsToDownload) {
    try {
      await downloadFont(font);
    } catch (err) {
      console.error(`Error downloading ${font.name}:`, err.message);
    }
  }
  console.log('All downloads completed.');
}

main();
