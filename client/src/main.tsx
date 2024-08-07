import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import worker from './mocks/browser';

async function enableMocking() {
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'warn',
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: { scope: '/' }
      }
    });

    // worker.listHandlers();
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
  );
});
