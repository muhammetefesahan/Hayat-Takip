import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Render
createRoot(document.getElementById('root')).render(<App />);

// Register service worker (root path)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
      .then(reg => console.log('SW registered, scope:', reg.scope))
      .catch(err => console.error('SW registration failed:', err));
  });
}
