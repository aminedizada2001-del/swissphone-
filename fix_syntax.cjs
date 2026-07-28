const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix `return ( {isOpen &&` by adding `<>`
  content = content.replace(/return\s*\(\s*\{/g, 'return (\n    <>\n      {');
  content = content.replace(/\}\s*\)\s*;/g, '}\n    </>\n  );');
  
  // Fix empty AnimatePresence removal
  // I actually just replaced it with ''
  
  // Remove motion props
  // We can use a simpler approach. Just remove initial={{...}} etc.
  const props = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileInView', 'viewport', 'layout', 'layoutId'];
  props.forEach(prop => {
    // A quick hack: just remove prop={...} where it might span multiple lines
    // This regex might be brittle, let's use a simpler one: just match `prop=\{[^\}]+\}` and `prop=\{\{[^\}]+\}\}`
    
    // We'll just remove them globally for these specific files, or we can use eslint --fix if we write a custom plugin, but that's overkill.
    // Let's do it manually for the files with syntax errors and then run tsc to find others.
  });

  fs.writeFileSync(filePath, content);
}

// Just apply to CartModal.tsx
processFile('src/components/CartModal.tsx');
