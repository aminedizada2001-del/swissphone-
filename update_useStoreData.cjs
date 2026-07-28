const fs = require('fs');

let content = fs.readFileSync('src/hooks/useStoreData.ts', 'utf-8');

// replace subscribeProducts logic
content = content.replace(
  /if \(remoteProducts && remoteProducts\.length > 0\) \{\s*setProducts\(remoteProducts\);\s*localStorage\.setItem\('swiss_products', JSON\.stringify\(remoteProducts\)\);\s*\}/,
  `if (remoteProducts && remoteProducts.length > 0) {
        const currentStr = localStorage.getItem('swiss_products');
        const remoteStr = JSON.stringify(remoteProducts);
        if (currentStr !== remoteStr) {
          setProducts(remoteProducts);
          localStorage.setItem('swiss_products', remoteStr);
        }
      }`
);

// replace subscribeServices logic
content = content.replace(
  /if \(remoteServices && remoteServices\.length > 0\) \{\s*setServices\(remoteServices\);\s*localStorage\.setItem\('swiss_services', JSON\.stringify\(remoteServices\)\);\s*\}/,
  `if (remoteServices && remoteServices.length > 0) {
        const currentStr = localStorage.getItem('swiss_services');
        const remoteStr = JSON.stringify(remoteServices);
        if (currentStr !== remoteStr) {
          setServices(remoteServices);
          localStorage.setItem('swiss_services', remoteStr);
        }
      }`
);

fs.writeFileSync('src/hooks/useStoreData.ts', content);
