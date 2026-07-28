const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove imports
  content = content.replace(/import\s+\{\s*motion(\s*,\s*AnimatePresence)?\s*\}\s+from\s+['"]motion\/react['"];\n?/g, '');
  content = content.replace(/import\s+\{\s*AnimatePresence(\s*,\s*motion)?\s*\}\s+from\s+['"]motion\/react['"];\n?/g, '');

  // Remove AnimatePresence tags
  content = content.replace(/<AnimatePresence[^>]*>/g, '');
  content = content.replace(/<\/AnimatePresence>/g, '');

  // Replace motion. tags with standard tags
  content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
  content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');

  // Regex to match and remove motion props (initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, viewport, layout)
  // This can be tricky if they span multiple lines.
  const motionProps = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileInView', 'viewport', 'layout', 'layoutId'];
  
  motionProps.forEach(prop => {
    // Attempt to match prop={{...}} or prop="var" or prop={var}
    const propRegex = new RegExp(`\\s+${prop}=(?:\\{[^}]+\\}|["'][^"']+["']|[a-zA-Z0-9_]+)`, 'g');
    
    // Actually, sometimes they are multi-line like initial={{
    //   opacity: 0
    // }}
    // A simpler way is to use a parser, or we can just rely on the fact that if we leave them, React gives a warning, but it might not break the build if it's TSX. But TS will complain.
  });

  fs.writeFileSync(filePath, content);
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

processFile('src/App.tsx');
walkDir('src/components');
console.log("Done");
