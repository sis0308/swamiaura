import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, CustomerOrder } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom database ID from config if present
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const isFirebaseActive = true;

/**
 * Real-time subscription to Products collection in Firestore
 */
export const subscribeProductsFromFirestore = (
  onData: (products: Product[]) => void,
  onError?: (err: unknown) => void
) => {
  try {
    const productsCol = collection(db, 'products');
    return onSnapshot(
      productsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            list.push({ ...data, id: docSnap.id });
          });
          onData(list);
        } else {
          onData([]);
        }
      },
      (err) => {
        console.warn('Firestore products onSnapshot warning:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to Firestore products:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Seed initial products into Firestore if the collection is empty
 */
export const seedInitialProductsIfEmpty = async (defaultProducts: Product[]) => {
  try {
    const productsCol = collection(db, 'products');
    const existing = await getDocs(productsCol);
    if (existing.empty && defaultProducts.length > 0) {
      console.log(`Seeding ${defaultProducts.length} default products to Firestore...`);
      const batch = writeBatch(db);
      for (const prod of defaultProducts) {
        const docRef = doc(db, 'products', prod.id);
        batch.set(docRef, prod);
      }
      await batch.commit();
      console.log('Seeding products to Firestore completed successfully.');
    }
  } catch (err) {
    console.warn('Failed to seed initial products to Firestore:', err);
  }
};

/**
 * Save / Update a product in Firestore
 */
export const saveProductToFirestore = async (product: Product) => {
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (err) {
    console.error('Failed to save product to Firestore:', err);
    throw err;
  }
};

/**
 * Delete a product from Firestore
 */
export const deleteProductFromFirestore = async (productId: string) => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
    throw err;
  }
};

/**
 * Real-time subscription to Orders collection in Firestore
 */
export const subscribeOrdersFromFirestore = (
  onData: (orders: CustomerOrder[]) => void,
  onError?: (err: unknown) => void
) => {
  try {
    const ordersCol = collection(db, 'orders');
    return onSnapshot(
      ordersCol,
      (snapshot) => {
        const list: CustomerOrder[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as CustomerOrder;
          list.push({ ...data, id: docSnap.id });
        });
        // Sort newest first
        list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        onData(list);
      },
      (err) => {
        console.warn('Firestore orders onSnapshot warning:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to Firestore orders:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Save / Update an order in Firestore
 */
export const saveOrderToFirestore = async (order: CustomerOrder) => {
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, order, { merge: true });
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
    throw err;
  }
};

/**
 * Delete an order from Firestore
 */
export const deleteOrderFromFirestore = async (orderId: string) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete order from Firestore:', err);
    throw err;
  }
};
