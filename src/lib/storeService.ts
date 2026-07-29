import { doc, setDoc, onSnapshot, collection, writeBatch, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Product, RepairService } from '../types';

export interface SiteSettings {
  storeInfo: {
    address: string;
    phone: string;
    email: string;
  };
  adminPassword?: string;
  socialLinks: {
    whatsapp: string;
    googleMaps: string;
    instagram: string;
    instagram2?: string;
    tiktok: string;
  };
  landingImages?: {
    heroBanner?: string;
    certifiedIphones?: string;
    originalSeal?: string;
    leatherCases?: string;
  };
}

// Global cached states and multiplexed listeners for zero-latency instant updates
let productsCache: Product[] | null = null;
const productsListeners = new Set<(products: Product[]) => void>();
let unsubProductsSnapshot: (() => void) | null = null;

export function subscribeProducts(
  onData: (products: Product[]) => void,
  onError?: (err: unknown) => void
) {
  if (productsCache && productsCache.length > 0) {
    onData(productsCache);
  }
  productsListeners.add(onData);

  if (!unsubProductsSnapshot) {
    try {
      unsubProductsSnapshot = onSnapshot(
        collection(db, 'products'),
        { includeMetadataChanges: false },
        (snapshot) => {
          if (!snapshot.empty) {
            productsCache = snapshot.docs.map(d => d.data() as Product);
            productsListeners.forEach(listener => listener(productsCache!));
          } else {
            productsCache = [];
            productsListeners.forEach(listener => listener([]));
          }
        },
        (error) => {
          console.warn('Firestore products read warning/error:', error);
          if (onError) onError(error);
        }
      );
    } catch (error) {
      console.error('Error setting up products listener:', error);
    }
  }

  return () => {
    productsListeners.delete(onData);
  };
}

// Fast targeted single product update
export async function updateProductInFirebase(product: Product) {
  try {
    await setDoc(doc(db, 'products', product.id), product, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'products');
  }
}

// Fast single product delete
export async function deleteProductFromFirebase(productId: string) {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'products');
  }
}

// Batch save products to Firebase (used for initial seeding)
export async function syncProductsToFirebase(products: Product[], removedProductId?: string) {
  try {
    if (removedProductId) {
      await deleteDoc(doc(db, 'products', removedProductId));
    }
    const batch = writeBatch(db);
    products.forEach((p) => {
      const ref = doc(db, 'products', p.id);
      batch.set(ref, p, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'products');
  }
}

// Global cached states and multiplexed listeners for repair services
let servicesCache: RepairService[] | null = null;
const servicesListeners = new Set<(services: RepairService[]) => void>();
let unsubServicesSnapshot: (() => void) | null = null;

export function subscribeServices(
  onData: (services: RepairService[]) => void,
  onError?: (err: unknown) => void
) {
  if (servicesCache && servicesCache.length > 0) {
    onData(servicesCache);
  }
  servicesListeners.add(onData);

  if (!unsubServicesSnapshot) {
    try {
      unsubServicesSnapshot = onSnapshot(
        collection(db, 'services'),
        { includeMetadataChanges: false },
        (snapshot) => {
          if (!snapshot.empty) {
            servicesCache = snapshot.docs.map(d => d.data() as RepairService);
            servicesListeners.forEach(listener => listener(servicesCache!));
          } else {
            servicesCache = [];
            servicesListeners.forEach(listener => listener([]));
          }
        },
        (error) => {
          console.warn('Firestore services read warning/error:', error);
          if (onError) onError(error);
        }
      );
    } catch (error) {
      console.error('Error setting up services listener:', error);
    }
  }

  return () => {
    servicesListeners.delete(onData);
  };
}

// Fast targeted single service update
export async function updateServiceInFirebase(service: RepairService) {
  try {
    await setDoc(doc(db, 'services', service.id), service, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'services');
  }
}

// Fast single service delete
export async function deleteServiceFromFirebase(serviceId: string) {
  try {
    await deleteDoc(doc(db, 'services', serviceId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'services');
  }
}

// Save services to Firebase
export async function syncServicesToFirebase(services: RepairService[], removedServiceId?: string) {
  try {
    if (removedServiceId) {
      await deleteDoc(doc(db, 'services', removedServiceId));
    }
    const batch = writeBatch(db);
    services.forEach((s) => {
      const ref = doc(db, 'services', s.id);
      batch.set(ref, s, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'services');
  }
}

// Global cached states and multiplexed listeners for Site Settings
let settingsCache: SiteSettings | null = null;
const settingsListeners = new Set<(settings: SiteSettings) => void>();
let unsubSettingsSnapshot: (() => void) | null = null;

export function subscribeSettings(
  onData: (settings: SiteSettings) => void,
  onError?: (err: unknown) => void
) {
  if (settingsCache) {
    onData(settingsCache);
  }
  settingsListeners.add(onData);

  if (!unsubSettingsSnapshot) {
    try {
      unsubSettingsSnapshot = onSnapshot(
        doc(db, 'settings', 'store'),
        { includeMetadataChanges: false },
        (snapshot) => {
          if (snapshot.exists()) {
            settingsCache = snapshot.data() as SiteSettings;
            settingsListeners.forEach(listener => listener(settingsCache!));
          }
        },
        (error) => {
          console.warn('Firestore settings read warning/error:', error);
          if (onError) onError(error);
        }
      );
    } catch (error) {
      console.error('Error setting up settings listener:', error);
    }
  }

  return () => {
    settingsListeners.delete(onData);
  };
}

// Save Site Settings to Firebase with cache update
export async function syncSettingsToFirebase(settings: SiteSettings) {
  try {
    settingsCache = settings;
    settingsListeners.forEach(listener => listener(settings));
    await setDoc(doc(db, 'settings', 'store'), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/store');
  }
}
