import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './assets/scss/index.scss';

import MainListener from './components/MainListener';
import Router from './routes';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import { initLocales } from './i18next';
import { initFirebase } from './services/firebase';
import { initDb } from './services/db';
import { initFunctions } from './services/functions';

initLocales();
initFirebase();
initDb();
initFunctions();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MainListener>
        <Router />
      </MainListener>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
