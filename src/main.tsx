import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// PWA functionality removed - no service worker needed

createRoot(document.getElementById("root")!).render(<App />);
