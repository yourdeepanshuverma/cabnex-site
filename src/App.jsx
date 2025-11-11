import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
import { SearchProvider } from './context/SearchContext';
import { Toaster } from 'sonner'; // Add this import
import { useWebsiteSettings } from './context/WebsiteSettingsContext';

import { VendorAuthProvider } from './vendor/context/VendorAuthContext';

function App() {
  const { settings } = useWebsiteSettings();

  useEffect(() => {
    if (settings) {
      document.title = settings.seo.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settings.seo.description);
      }
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.setAttribute('href', settings.favicon.url);
      }
    }
  }, [settings]);

  return (
    <SearchProvider>
      <VendorAuthProvider>
        <Router>
          <main className="min-h-screen">
            <AppRoutes />
            {/* Add Toaster for notifications */}
            <Toaster 
              position="top-center" 
              richColors 
              closeButton 
              toastOptions={{
                classNames: {
                  toast: "font-grotesk", // Match your font
                  description: "font-grotesk",
                },
              }}
            />
          </main>
        </Router>
      </VendorAuthProvider>
    </SearchProvider>
  );
}

export default App;