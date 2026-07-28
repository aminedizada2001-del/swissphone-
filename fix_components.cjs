const fs = require('fs');

const files = [
  'src/components/AuthenticitySection.tsx',
  'src/components/Footer.tsx',
  'src/components/HeroSection.tsx',
  'src/components/StoreInfoSection.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Remove static import
  content = content.replace(/import\s+\{\s*subscribeSettings\s*\}\s+from\s+['"]\.\.\/lib\/storeService['"];\n?/g, '');
  
  // Replace subscribeSettings usage
  content = content.replace(
    /const unsubscribe = subscribeSettings\(\(remoteSettings\) => \{/,
    `let unsubscribe = () => {};\n    import('../lib/storeService').then(({ subscribeSettings }) => {\n      unsubscribe = subscribeSettings((remoteSettings) => {`
  );
  
  // find the corresponding return () => unsubscribe();
  // which is usually:
  //    });
  //    return () => unsubscribe();
  //  }, []);
  content = content.replace(
    /      \}\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}, \[\]\);/g,
    `      }
    });
    });
    return () => unsubscribe();
  }, []);`
  );

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
