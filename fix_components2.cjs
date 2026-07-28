const fs = require('fs');

const files = [
  'src/components/AuthenticitySection.tsx',
  'src/components/Footer.tsx',
  'src/components/HeroSection.tsx',
  'src/components/StoreInfoSection.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Just use simple replacement or check the syntax
  // Let's checkout and do it with a better script
});
