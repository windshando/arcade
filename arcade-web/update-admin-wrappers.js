const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else if (file.endsWith('page.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const pages = walkDir('src/app/[locale]/admin');
let count = 0;

pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // This matches 'return ( <div className="something">'
  // and captures everything up to the class quote.
  const regex = /(return\s*\(\s*<div\s+className=\")[^\"]+(\")/i;
  
  if (regex.test(content)) {
    content = content.replace(regex, '$1p-6 md:p-8 w-full max-w-[1600px] mx-auto animate-fade-in space-y-6$2');
    fs.writeFileSync(file, content);
    count++;
  } else {
    console.log('Could not match root div in:', file);
  }
});

console.log('Updated', count, 'files.');
