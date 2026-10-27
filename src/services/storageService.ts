import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { defaultMasterAppData } from '../data/defaultAppData';
import { AppData } from '../types';

import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');

const STORAGE_KEY = 'inflow2036_data_v1';
const FIRESTORE_DOC_PATH = 'workspaces/inflow2036_user_data';

export class StorageService {
  static loadAppData(): AppData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            ...defaultMasterAppData,
            ...parsed
          };
        }
      }
    } catch (e) {
      console.warn('StorageService: Error loading localStorage', e);
    }
    return defaultMasterAppData;
  }

  static async syncWithCloud(): Promise<AppData> {
    try {
      const docRef = doc(db, 'workspaces', 'inflow2036_workspace');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cloudData = snap.data() as AppData;
        const merged: AppData = {
          ...defaultMasterAppData,
          ...cloudData
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      } else {
        // First time initialization in Firebase with fresh seed data
        const initial = this.loadAppData();
        await setDoc(docRef, initial);
        return initial;
      }
    } catch (e) {
      console.error('StorageService: Cloud sync failed, using local storage', e);
      return this.loadAppData();
    }
  }

  static saveAppData(data: AppData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Asynchronously push to Firebase
      const docRef = doc(db, 'workspaces', 'inflow2036_workspace');
      setDoc(docRef, data).catch(err => console.error('Cloud save failed:', err));
    } catch (e) {
      console.error('StorageService: Error saving data', e);
    }
  }

  static exportBackup(data: AppData): void {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `inflow2036_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async importBackup(file: File): Promise<AppData | null> {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        const merged: AppData = {
          ...defaultMasterAppData,
          ...parsed
        };
        this.saveAppData(merged);
        return merged;
      }
    } catch (err) {
      console.error('StorageService: Backup import failed', err);
    }
    return null;
  }

  static resetToDefaults(): AppData {
    this.saveAppData(defaultMasterAppData);
    return defaultMasterAppData;
  }
}
