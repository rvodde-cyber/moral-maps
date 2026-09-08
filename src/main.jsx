import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MoralMaps from './MoralMaps.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MoralMaps />
  </StrictMode>,
)

// Service worker registreren (alleen in productie-build, niet tijdens dev/HMR),
// zodat de app offline opent zodra hij één keer bezocht is.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
