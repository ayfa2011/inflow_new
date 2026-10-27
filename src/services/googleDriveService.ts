import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppData } from '../types';

const app = getApps().length > 0 ? getApp() : initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

const auth = getAuth(app);
let cachedAccessToken: string | null = null;

export interface DriveUploadResult {
  success: boolean;
  fileName?: string;
  fileId?: string;
  folderId?: string;
  webViewLink?: string;
  error?: string;
}

export class GoogleDriveService {
  /**
   * Acquire Google OAuth Access Token with drive.file scope using Firebase Auth
   */
  static async getAccessToken(forcePrompt = false): Promise<string> {
    if (cachedAccessToken && !forcePrompt) {
      return cachedAccessToken;
    }

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.setCustomParameters({
      prompt: 'consent'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('Google OAuth access token not received');
      }
      cachedAccessToken = credential.accessToken;
      return cachedAccessToken;
    } catch (err: any) {
      console.error('Google Auth Popup Error:', err);
      throw new Error(err?.message || 'Failed to authenticate with Google Drive');
    }
  }

  /**
   * Find or create folder in Google Drive
   */
  static async findOrCreateFolder(accessToken: string, folderName = 'inflow2036_Backups'): Promise<string> {
    // Search for folder
    const query = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      throw new Error(`Failed to query Google Drive: ${errText}`);
    }

    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    // Create folder if not found
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Failed to create Google Drive folder: ${errText}`);
    }

    const folderData = await createRes.json();
    return folderData.id;
  }

  /**
   * Upload JSON backup file directly to Google Drive in specified folder
   */
  static async uploadBackupToDrive(data: AppData, folderName = 'inflow2036_Backups'): Promise<DriveUploadResult> {
    try {
      const accessToken = await this.getAccessToken();
      const folderId = await this.findOrCreateFolder(accessToken, folderName);

      const dateStr = new Date().toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];
      const fileName = `inflow2036_backup_${dateStr}.json`;
      const jsonContent = JSON.stringify(data, null, 2);

      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: [folderId]
      };

      const boundary = 'foo_bar_baz_inflow2036';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        jsonContent +
        closeDelimiter;

      const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartRequestBody
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Failed to upload backup to Google Drive: ${errText}`);
      }

      const fileResult = await uploadRes.json();

      return {
        success: true,
        fileName: fileResult.name || fileName,
        fileId: fileResult.id,
        folderId,
        webViewLink: fileResult.webViewLink || `https://drive.google.com/drive/folders/${folderId}`
      };
    } catch (error: any) {
      console.error('Google Drive Backup Error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error uploading backup to Google Drive'
      };
    }
  }
}
