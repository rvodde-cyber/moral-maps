import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MoralMaps from './App.jsx'; // We importeren MoralMaps
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <MoralMaps /> {/* We gebruiken hier ook MoralMaps */}
    </StrictMode>
  );
}

