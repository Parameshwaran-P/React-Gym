// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { setupGlobalErrorHandlers, checkBrowserCompatibility } from './shared/utils/setupGlobalErrorHandlers';
import { AuthProvider } from './features/auth/context/AuthContext'; 
// Setup global error handlers
setupGlobalErrorHandlers();

// Check browser compatibility
checkBrowserCompatibility();

ReactDOM.createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ADD THIS */}
        <App />
      </AuthProvider> {/* ADD THIS */}
    </BrowserRouter>
  </React.StrictMode>
);