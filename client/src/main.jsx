import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SiteContextProvider } from './context/SiteContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SiteContextProvider>
        <App />
      </SiteContextProvider>
    </BrowserRouter>
  </StrictMode>
);
