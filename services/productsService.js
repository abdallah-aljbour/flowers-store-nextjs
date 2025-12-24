import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../config/firebase";

const COLLECTION_NAME = "products";
const PAGE_SIZE = 20;

export const productsService = {
  // جلب صفحة معينة
  getPage: async (pageNumber = 1, lastVisible = null) => {
    try {
      let q;

      if (pageNumber === 1) {
        // الصفحة الأولى
        q = query(
          collection(db, COLLECTION_NAME),
          where("isPublished", "==", true),
          orderBy("order", "asc"),
          limit(PAGE_SIZE)
        );
      } else {
        // الصفحات التالية
        q = query(
          collection(db, COLLECTION_NAME),
          where("isPublished", "==", true),
          orderBy("order", "asc"),
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);

      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // آخر document للصفحة التالية
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];

      return {
        products,
        lastDoc,
        hasMore: snapshot.docs.length === PAGE_SIZE,
      };
    } catch (error) {
      console.error("Error fetching page:", error);
      return { products: [], lastDoc: null, hasMore: false };
    }
  },

  // جلب إجمالي عدد المنتجات المنشورة
  getTotalCount: async () => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("isPublished", "==", true)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Error getting total count:", error);
      return 0;
    }
  },

  // جلب منتج واحد
  getById: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },
};
