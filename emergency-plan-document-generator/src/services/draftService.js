import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const DRAFTS_COLLECTION = "drafts";

/**
 * @param {string} userId
 * @param {object} formData - same shape as CreateNewDocument form
 * @returns {Promise<string>} draft id
 */
export async function saveDraft(userId, formData) {
  const draftsRef = collection(db, DRAFTS_COLLECTION);
  const newRef = doc(draftsRef);
  await setDoc(newRef, {
    userId,
    ...formData,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
  return newRef.id;
}

/**
 * @param {string} draftId
 * @param {string} userId
 * @param {object} formData
 */
export async function updateDraft(draftId, userId, formData) {
  const draftRef = doc(db, DRAFTS_COLLECTION, draftId);
  const snap = await getDoc(draftRef);
  if (!snap.exists() || snap.data().userId !== userId) {
    throw new Error("Draft not found or access denied");
  }
  await setDoc(draftRef, {
    userId,
    ...formData,
    updatedAt: serverTimestamp(),
    createdAt: snap.data().createdAt,
  });
}

/**
 * @param {string} userId
 * @returns {Promise<Array<{ id: string, ...formData, updatedAt, createdAt }>>}
 */
export async function listDrafts(userId) {
  const draftsRef = collection(db, DRAFTS_COLLECTION);
  const q = query(draftsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    updatedAt: d.data().updatedAt?.toDate?.() ?? null,
    createdAt: d.data().createdAt?.toDate?.() ?? null,
  }));
  list.sort((a, b) => {
    const ta = a.updatedAt?.getTime?.() ?? 0;
    const tb = b.updatedAt?.getTime?.() ?? 0;
    return tb - ta;
  });
  return list.map((d) => ({
    ...d,
    updatedAt: d.updatedAt?.toISOString?.() ?? null,
    createdAt: d.createdAt?.toISOString?.() ?? null,
  }));
}

/**
 * @param {string} draftId
 * @param {string} userId
 * @returns {Promise<object|null>} draft form data or null
 */
export async function getDraft(draftId, userId) {
  const draftRef = doc(db, DRAFTS_COLLECTION, draftId);
  const snap = await getDoc(draftRef);
  if (!snap.exists() || snap.data().userId !== userId) {
    return null;
  }
  const data = snap.data();
  const { userId: _uid, updatedAt, createdAt, ...formData } = data;
  return {
    id: snap.id,
    ...formData,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
  };
}

/**
 * @param {string} draftId
 * @param {string} userId
 */
export async function deleteDraft(draftId, userId) {
  const draftRef = doc(db, DRAFTS_COLLECTION, draftId);
  const snap = await getDoc(draftRef);
  if (!snap.exists() || snap.data().userId !== userId) {
    throw new Error("Draft not found or access denied");
  }
  await deleteDoc(draftRef);
}
