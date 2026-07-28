import { useState, useEffect } from 'react';
import { Product, RepairService } from '../types';
import { PRODUCTS } from '../data/products';
import { INITIAL_SERVICES } from '../data/services';
import { subscribeProducts, subscribeServices, syncProductsToFirebase, syncServicesToFirebase } from '../lib/storeService';

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

  // Subscribe to Firebase realtime updates
  useEffect(() => {
    const unsubProducts = subscribeProducts((remoteProducts) => {
      if (remoteProducts && remoteProducts.length > 0) {
        setProducts(remoteProducts);
        localStorage.setItem('swiss_products', JSON.stringify(remoteProducts));
      } else {
        // If remote database is empty, seed it with default products
        syncProductsToFirebase(PRODUCTS);
      }
    });

    const unsubServices = subscribeServices((remoteServices) => {
      if (remoteServices && remoteServices.length > 0) {
        setServices(remoteServices);
        localStorage.setItem('swiss_services', JSON.stringify(remoteServices));
      } else {
        // Seed default services
        syncServicesToFirebase(INITIAL_SERVICES);
      }
    });

    return () => {
      unsubProducts();
      unsubServices();
    };
  }, []);

  const saveProducts = (newProducts: Product[], removedId?: string) => {
    setProducts(newProducts);
    localStorage.setItem('swiss_products', JSON.stringify(newProducts));
    syncProductsToFirebase(newProducts, removedId);
  };

  const saveServices = (newServices: RepairService[], removedId?: string) => {
    setServices(newServices);
    localStorage.setItem('swiss_services', JSON.stringify(newServices));
    syncServicesToFirebase(newServices, removedId);
  };

  return {
    products,
    services,
    saveProducts,
    saveServices
  };
}

