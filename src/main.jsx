// src/main.jsx
import React, { startTransition } from 'react';
import { createRoot } from 'react-dom/client';

// Poistettu: import { Provider } from 'react-redux';
// Poistettu: import MainListener from './components/MainListener';
// Poistettu: import store from './redux/store';

// Kaikki alustukset SÄILYTETÄÄN, koska ne ovat Node.js/global-tason asioita
// Esim: import { initAuth } from './services/auth'; jne.

import App from './App'; // React Routerin juuri

// ... (Kaikki initXXX() kutsut säilyvät TÄÄLLÄ) ...

const container = document.getElementById('root');
// ... (root.render-lohko säilyy) ...

startTransition(() => {
  root.render(
    <React.StrictMode>
      {/* TÄSTÄ PUUTTUU NYT <Provider> ja <MainListener> */}
      <App />
    </React.StrictMode>,
  );
});
