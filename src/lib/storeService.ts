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
}

// Realtime listener for products
export function subscribeProducts(
  onData: (products: Product[]) => void,
  onError?: (err: unknown) => void
) {
  try {
    return onSnapshot(
      collection(db, 'products'),
      { includeMetadataChanges: false },
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as Product);
          onData(list);
        } else {
          onData([]);
        }
      },
      (error) => {
        console.warn('Firestore products read warning/error:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up products listener:', error);
    return () => {};
  }
}

// Save products to Firebase
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

// Realtime listener for services
export function subscribeServices(
  onData: (services: RepairService[]) => void,
  onError?: (err: unknown) => void
) {
  try {
    return onSnapshot(
      collection(db, 'services'),
      { includeMetadataChanges: false },
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as RepairService);
          onData(list);
        } else {
          onData([]);
        }
      },
      (error) => {
        console.warn('Firestore services read warning/error:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up services listener:', error);
    return () => {};
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

// Realtime listener for Site Settings
export function subscribeSettings(
  onData: (settings: SiteSettings) => void,
  onError?: (err: unknown) => void
) {
  try {
    return onSnapshot(
      doc(db, 'settings', 'store'),
      { includeMetadataChanges: false },
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data() as SiteSettings);
        }
      },
      (error) => {
        console.warn('Firestore settings read warning/error:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up settings listener:', error);
    return () => {};
  }
}

// Save Site Settings to Firebase
export async function syncSettingsToFirebase(settings: SiteSettings) {
  try {
    await setDoc(doc(db, 'settings', 'store'), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/store');
  }
}
