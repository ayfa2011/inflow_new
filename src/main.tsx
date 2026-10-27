import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  if (import.meta.env.DEV && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    }).catch(() => {});
  }
} catch (e) {
  // Ignore SW access restrictions in restricted iframe sandbox
}

createRoot(document.getElementById('root')!).render(<App />);


