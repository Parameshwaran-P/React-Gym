// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupGlobalErrorHandlers, checkBrowserCompatibility } from './shared/utils/setupGlobalErrorHandlers';

// Setup global error handlers
setupGlobalErrorHandlers();

// Check browser compatibility
checkBrowserCompatibility();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);