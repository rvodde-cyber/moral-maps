import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MoralMaps from './MoralMaps.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MoralMaps />
  </StrictMode>,
)
