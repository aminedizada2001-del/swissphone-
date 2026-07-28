const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

content = content.replace(
  /        if \(remoteSettings\.landingImages\) \{\n          setLandingImages\(remoteSettings\.landingImages\);\n        \}\n      \}\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}, \[\]\);/,
  `        if (remoteSettings.landingImages) {
          setLandingImages(remoteSettings.landingImages);
        }
      }
    });
    });
    return () => unsubscribe();
  }, []);`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
