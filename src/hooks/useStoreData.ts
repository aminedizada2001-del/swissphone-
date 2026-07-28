import { useState, useEffect } from 'react';
import { Product, RepairService } from '../types';
import { PRODUCTS } from '../data/products';
import { INITIAL_SERVICES } from '../data/services';

export function useStoreData() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('swiss_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PRODUCTS;
  });

  const [services, setServices] = useState<RepairService[]>(() => {
    const saved = localStorage.getItem('swiss_services');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SERVICES;
  });

  useEffect(() => {
    let unsubProducts = () => {};
    let unsubServices = () => {};

    // Dynamically import Firebase to avoid blocking initial render
    import('../lib/storeService').then(({ subscribeProducts, subscribeServices, syncProductsToFirebase, syncServicesToFirebase }) => {
      unsubProducts = subscribeProducts((remoteProducts) => {
        if (remoteProducts && remoteProducts.length > 0) {
          const currentStr = localStorage.getItem('swiss_products');
          const remoteStr = JSON.stringify(remoteProducts);
          if (currentStr !== remoteStr) {
            setProducts(remoteProducts);
            localStorage.setItem('swiss_products', remoteStr);
          }
        } else {
          syncProductsToFirebase(PRODUCTS);
        }
      });

      unsubServices = subscribeServices((remoteServices) => {
        if (remoteServices && remoteServices.length > 0) {
          const currentStr = localStorage.getItem('swiss_services');
          const remoteStr = JSON.stringify(remoteServices);
          if (currentStr !== remoteStr) {
            setServices(remoteServices);
            localStorage.setItem('swiss_services', remoteStr);
          }
        } else {
          syncServicesToFirebase(INITIAL_SERVICES);
        }
      });
    });

    return () => {
      unsubProducts();
      unsubServices();
    };
  }, []);

  const saveProducts = async (newProducts: Product[], removedId?: string) => {
    setProducts(newProducts);
    localStorage.setItem('swiss_products', JSON.stringify(newProducts));
    
    // Find the difference to optimize writes
    const { syncProductsToFirebase, updateProductInFirebase, deleteProductFromFirebase } = await import('../lib/storeService');
    
    if (removedId) {
      deleteProductFromFirebase(removedId);
      return;
    }
    
    // Simple heuristic: if lengths match, it's an update. If new is larger, it's an add.
    // For a robust approach, we just rewrite all for now to avoid logic bugs, or we can find the single changed item.
    syncProductsToFirebase(newProducts, removedId);
  };

  const saveServices = async (newServices: RepairService[], removedId?: string) => {
    setServices(newServices);
    localStorage.setItem('swiss_services', JSON.stringify(newServices));
    const { syncServicesToFirebase } = await import('../lib/storeService');
    syncServicesToFirebase(newServices, removedId);
  };

  return {
    products,
    services,
    saveProducts,
    saveServices
  };
}
