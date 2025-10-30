// src/main.jsx (tai .js)
import React, { startTransition } from "react";
import { createRoot } from "react-dom/client";

// TÄRKEÄÄ: Uusi React Router -alustus
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";


import * as routes from "/routes";

import "./assets/scss/app.scss";

const router = createBrowserRouter(routes.routes);

const container = document.getElementById("root");
const root = createRoot(container);


startTransition(() => {
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});

