const fs = require('fs');
const path = require('path');

const colorMap = [
  // bg-primary-*, text-primary-*, hover:bg-primary-*, etc.
  { regex: /bg-primary-(?:50|100|200|300|400|500|600|700|800|900|950)/g, replace: 'bg-primaire' },
  { regex: /bg-primary/g, replace: 'bg-primaire' },
  { regex: /text-primary-(?:50|100|200|300|400|500|600|700|800|900|950)/g, replace: 'text-primaire' },
  { regex: /text-primary/g, replace: 'text-primaire' },
  { regex: /hover:bg-primary-(?:50|100|200|300|400|500|600|700|800|900|950)/g, replace: 'hover:bg-primaire' },
  { regex: /hover:bg-primary/g, replace: 'hover:bg-primaire' },
  { regex: /hover:text-primary-(?:50|100|200|300|400|500|600|700|800|900|950)/g, replace: 'hover:text-primaire' },
  { regex: /hover:text-primary/g, replace: 'hover:text-primaire' },
  // Ajoute ici d'autres mappings si besoin (ex: border-primary, etc.)
];

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let content = original;
  colorMap.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });
  if (content !== original) {
    fs.writeFileSync(filePath + '.bak', original, 'utf8');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modifié :', filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

walk(path.join(__dirname, 'src'));
console.log('Remplacement terminé. Vérifie les .bak si besoin de rollback.');