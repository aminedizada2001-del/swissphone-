const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  const originalContent = content;

  // Remove motion imports
  content = content.replace(/import\s+\{([^}]*)\}\s+from\s+['"]motion\/react['"];/g, '');

  // Remove <AnimatePresence> and </AnimatePresence>
  content = content.replace(/<AnimatePresence[^>]*>/g, '');
  content = content.replace(/<\/AnimatePresence>/g, '');

  // Replace <motion.div ...> with <div ...>
  content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
  content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');

  // Remove framer-motion specific props
  const propsToRemove = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileInView', 'viewport', 'layoutId', 'layout'];
  
  propsToRemove.forEach(prop => {
    // match prop={{ ... }}
    const regex1 = new RegExp(`\\s+${prop}=\\{\\{[^}]*\\}\\}(?=\\s|>)`, 'g');
    content = content.replace(regex1, '');
    
    // match prop={...}
    const regex2 = new RegExp(`\\s+${prop}=\\{[^}]*\\}(?=\\s|>)`, 'g');
    content = content.replace(regex2, '');
    
    // match prop="..."
    const regex3 = new RegExp(`\\s+${prop}=["'][^"']*["'](?=\\s|>)`, 'g');
    content = content.replace(regex3, '');
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Processed ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

walkDir('src/components');
console.log("Done");
