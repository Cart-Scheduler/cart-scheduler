import React, { startTransition } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import { Provider } from 'react-redux';
import store from "./app/redux/store";



import "./assets/scss/app.scss";

import * as routeData from "/routes";

const router = createBrowserRouter(routeData.default);

const container = document.getElementById("root");
const root = createRoot(container);

startTransition(() => {
  root.render(
    <React.StrictMode>

      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
});

