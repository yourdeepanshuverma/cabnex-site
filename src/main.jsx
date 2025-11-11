import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WebsiteSettingsProvider } from './context/WebsiteSettingsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WebsiteSettingsProvider>
      <App />
    </WebsiteSettingsProvider>
  </StrictMode>,
)
