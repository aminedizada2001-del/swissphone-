const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// Replace subscribeSettings
content = content.replace(
  /const unsubscribe = subscribeSettings\(\(remoteSettings\) => \{/,
  `let unsubscribe = () => {};\n    import('../lib/storeService').then(({ subscribeSettings }) => {\n      unsubscribe = subscribeSettings((remoteSettings) => {`
);

content = content.replace(
  /        if \(remoteSettings\.landingImages\) setLandingImages\(remoteSettings\.landingImages\);\n      \}\n    \}\);\n\n    return \(\) => unsubscribe\(\);\n  \}, \[\]\);/,
  `        if (remoteSettings.landingImages) setLandingImages(remoteSettings.landingImages);\n      }\n    });\n    });\n\n    return () => unsubscribe();\n  }, []);`
);

// Replace syncSettingsToFirebase
content = content.replace(
  /    syncSettingsToFirebase\(data\);\n    setIsSaved\(true\);\n    setTimeout\(\(\) => \{\n      setIsSaved\(false\);\n    \}, 2500\);\n  \};/,
  `    import('../lib/storeService').then(({ syncSettingsToFirebase }) => {\n      syncSettingsToFirebase(data);\n      setIsSaved(true);\n      setTimeout(() => {\n        setIsSaved(false);\n      }, 2500);\n    });\n  };`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
