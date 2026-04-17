import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MoralMaps from './MoralMaps.jsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <MoralMaps />
    </StrictMode>
  );
}
