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
    
    const { syncProductsToFirebase, updateProductInFirebase, deleteProductFromFirebase } = await import('../lib/storeService');
    
    if (removedId) {
      deleteProductFromFirebase(removedId);
      return;
    }
    
    // Find modified or added items
    const oldMap = new Map(products.map(p => [p.id, p]));
    const changed = newProducts.filter(p => {
      const oldP = oldMap.get(p.id);
      return !oldP || JSON.stringify(oldP) !== JSON.stringify(p);
    });

    if (changed.length === 1) {
      updateProductInFirebase(changed[0]);
    } else {
      syncProductsToFirebase(newProducts);
    }
  };

  const saveServices = async (newServices: RepairService[], removedId?: string) => {
    setServices(newServices);
    localStorage.setItem('swiss_services', JSON.stringify(newServices));
    
    const { syncServicesToFirebase, updateServiceInFirebase, deleteServiceFromFirebase } = await import('../lib/storeService');
    
    if (removedId) {
      deleteServiceFromFirebase(removedId);
      return;
    }

    const oldMap = new Map(services.map(s => [s.id, s]));
    const changed = newServices.filter(s => {
      const oldS = oldMap.get(s.id);
      return !oldS || JSON.stringify(oldS) !== JSON.stringify(s);
    });

    if (changed.length === 1) {
      updateServiceInFirebase(changed[0]);
    } else {
      syncServicesToFirebase(newServices);
    }
  };

  return {
    products,
    services,
    saveProducts,
    saveServices
  };
}
