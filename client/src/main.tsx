import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import worker from './mocks/browser';

async function enableMocking() {
  if (import.meta.env.DEV) {
    if (import.meta.env.VITE_LOCAL_SERVER !== 'true') {
      console.log('starting msw');
      // Start MSW
      await worker.start({
        onUnhandledRequest: 'warn',
        serviceWorker: {
          url: '/mockServiceWorker.js',
          options: { scope: '/' }
        }
      });
    }
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
  );
});
