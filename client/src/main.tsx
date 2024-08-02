import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import worker from './mocks/browser';

if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js',
      options: { scope: '/' }
    }
  });

  worker.listHandlers();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
