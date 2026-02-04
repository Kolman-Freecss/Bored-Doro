import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const saved = localStorage.getItem('boreddoro-theme');
if (saved === 'dark' || saved === 'light') {
  document.documentElement.setAttribute('data-theme', saved);
}

/* Ionic core CSS – required for layout and components */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import './theme/variables.css';
import './App.css';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
