import fs from 'fs';
import path from 'path';

const searchDir = 'c:/Users/anton_mn7up/Downloads/IADIRECTO/sure-app/src';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(searchDir, (err, files) => {
  if (err) throw err;
  let matches = [];
  files.forEach(file => {
    // Only search text files
    if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json') || file.endsWith('.md')) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('buy.stripe.com')) {
        matches.push(file);
      }
    }
  });
  console.log("MATCHING FILES WITH STRIPE LINKS:");
  console.log(matches);
});
