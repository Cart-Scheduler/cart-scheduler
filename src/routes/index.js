import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RC from './RouteContent';

import DefaultLayout from '../layouts/Default';
import SignInLayout from '../layouts/SignIn';

const Home = React.lazy(() => import('../app/Home'));
const JoinProgram = React.lazy(() => import('../app/join'));
const SignIn = React.lazy(() => import('../app/signin'));
const SignInLink = React.lazy(() => import('../app/signin/Link'));
const SignOut = React.lazy(() => import('../app/SignOut'));

// The path where user is redirected to after authentication by default
export const DEFAULT_PATH = '/';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          element={<RC isPublic element={<SignInLayout />} />}
        >
          <Route index element={<RC isPublic element={<SignIn />} />} />
          <Route
            path="link/:programId?"
            element={<RC isPublic element={<SignInLink />} />}
          />
        </Route>
        <Route
          path="/signout"
          element={<RC isPublic element={<SignOut />} />}
        />
        <Route
          path="/join/:programId"
          element={<RC element={<JoinProgram />} />}
        />
        <Route path="/" element={<RC element={<DefaultLayout />} />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
