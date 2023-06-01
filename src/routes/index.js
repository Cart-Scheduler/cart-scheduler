import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RC from './RouteContent';

import DefaultLayout from '../layouts/Default';
import SignInLayout from '../layouts/SignIn';

const Home = React.lazy(() => import('../app/Home'));
const JoinProject = React.lazy(() => import('../app/join/page'));
const Profile = React.lazy(() => import('../app/profile/page'));
const ProjectList = React.lazy(() => import('../app/projects/page'));
const Project = React.lazy(() => import('../app/projects/project/page'));
const SignIn = React.lazy(() => import('../app/signin/page'));
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
            path="link"
            element={<RC isPublic element={<SignInLink />} />}
          />
        </Route>
        <Route
          path="/signout"
          element={<RC isPublic element={<SignOut />} />}
        />
        <Route path="/" element={<RC element={<DefaultLayout />} />}>
          <Route
            path="join/:projectId"
            element={<RC element={<JoinProject />} />}
          />
          <Route path="projects">
            <Route path=":projectId" element={<RC element={<Project />} />} />
            <Route index element={<RC element={<ProjectList />} />} />
          </Route>
          <Route path="profile" element={<RC element={<Profile />} />} />
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
