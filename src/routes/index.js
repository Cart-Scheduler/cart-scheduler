import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RC from './RouteContent';

import Layout from '../layouts/Default';

const Home = React.lazy(() => import('../app/Home'));
const Login = React.lazy(() => import('../app/account/Login'));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/account/login"
          element={<RC isPublic element={<Login />} />}
        />

        <Route path="/" element={<Layout />}>
          <Route index element={<RC element={<Home />} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
