import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { defaultMasterAppData } from '../data/defaultAppData';
import { AppData } from '../types';
import { getLocalDateString } from '../utils/dateUtils';
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
let cloudSaveTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Validates and sanitizes parsed JSON object into a typed AppData structure.
 * Ensures array fields are valid Array instances to prevent runtime crashes.
 */
function sanitizeAppData(raw: any): AppData {
  if (!raw || typeof raw !== 'object') {
    return { ...defaultMasterAppData };
  }

  const result: AppData = { ...defaultMasterAppData };

  const arrayKeys: (keyof AppData)[] = [
    'runWalk',
    'habits',
    'quickNotes',
    'diary',
    'liabilityAssets',
    'savingBanks',
    'salaries',
    'bucketList',
    'plans',
    'graphicJobs',
    'inflowHoldings',
    'trades',
    'skills',
    'specialDays',
    'health'
  ];

  for (const key of arrayKeys) {
    if (Array.isArray(raw[key])) {
      (result as any)[key] = raw[key];
    } else {
      (result as any)[key] = defaultMasterAppData[key] || [];
    }
  }

  if (typeof raw.lastModified === 'string') {
    result.lastModified = raw.lastModified;
  }

  return result;
}

export class StorageService {
  static loadAppData(): AppData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return sanitizeAppData(parsed);
      }
    } catch (e) {
      console.warn('StorageService: Error loading localStorage', e);
    }
    return { ...defaultMasterAppData };
  }

  static async syncWithCloud(): Promise<AppData> {
    const localData = this.loadAppData();
    try {
      const docRef = doc(db, 'workspaces', 'inflow2036_workspace');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cloudRaw = snap.data();
        const cloudData = sanitizeAppData(cloudRaw);

        // Compare lastModified timestamps to avoid overwriting newer local edits
        const localTime = new Date(localData.lastModified || 0).getTime();
        const cloudTime = new Date(cloudData.lastModified || 0).getTime();

        if (cloudTime > localTime) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
          return cloudData;
        } else {
          // Local data is newer or equal, sync local to cloud
          this.scheduleCloudSave(localData);
          return localData;
        }
      } else {
        // First time cloud initialization
        this.scheduleCloudSave(localData);
        return localData;
      }
    } catch (e) {
      console.warn('StorageService: Cloud sync offline, using local storage');
      return localData;
    }
  }

  static saveAppData(data: AppData): AppData {
    const dataWithTimestamp: AppData = {
      ...data,
      lastModified: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
      this.scheduleCloudSave(dataWithTimestamp);
    } catch (e) {
      console.warn('StorageService: Error saving local data', e);
    }

    return dataWithTimestamp;
  }

  private static scheduleCloudSave(data: AppData): void {
    if (cloudSaveTimeout) {
      clearTimeout(cloudSaveTimeout);
    }

    // Debounce cloud push by 1500ms to avoid setDoc flooding on fast keystrokes
    cloudSaveTimeout = setTimeout(() => {
      try {
        const docRef = doc(db, 'workspaces', 'inflow2036_workspace');
        setDoc(docRef, data).catch(err => console.warn('Cloud save deferred:', err?.message || err));
      } catch (e) {
        console.warn('StorageService: Cloud save error', e);
      }
    }, 1500);
  }

  static exportBackup(data: AppData): void {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = getLocalDateString();
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
        const sanitized = sanitizeAppData(parsed);
        const saved = this.saveAppData(sanitized);
        return saved;
      }
    } catch (err) {
      console.error('StorageService: Backup import failed', err);
    }
    return null;
  }

  static resetToDefaults(): AppData {
    const saved = this.saveAppData({ ...defaultMasterAppData });
    return saved;
  }
}
