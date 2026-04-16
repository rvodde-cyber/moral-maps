import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'    /* Let op de ./ voor de naam */
import './index.css'           /* Zorg dat dit naar je Teal CSS verwijst */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
