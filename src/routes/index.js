import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RC from './RouteContent';

import DefaultLayout from '../layouts/Default';
import SignInLayout from '../layouts/SignIn';

const Home = React.lazy(() => import('../app/Home'));
const JoinProject = React.lazy(() => import('../app/join/page'));
const Profile = React.lazy(() => import('../app/profile/page'));
const ProjectList = React.lazy(() => import('../app/projects/page'));
const CreateProject = React.lazy(() => import('../app/projects/new/page'));
const Project = React.lazy(() => import('../app/projects/project/page'));
const ProjectAdmin = React.lazy(() =>
  import('../app/projects/project/admin/page'),
);
const SignIn = React.lazy(() => import('../app/signin/page'));
const SignInLink = React.lazy(() => import('../app/signin/Link'));
const SignOut = React.lazy(() => import('../app/SignOut'));
const SignUpPassword = React.lazy(() => import('../app/signup/password/page'));
const PrivacyPolicy = React.lazy(() => import('../app/PrivacyPolicy'));
const TermsOfUse = React.lazy(() => import('../app/TermsOfUse'));
const Members = React.lazy(() =>
  import('../app/projects/project/admin/members/page'),
);

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
          path="/signup"
          element={<RC isPublic element={<SignInLayout />} />}
        >
          <Route
            path="password"
            element={<RC isPublic element={<SignUpPassword />} />}
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
            <Route path="new" element={<RC element={<CreateProject />} />} />
            <Route path=":projectId">
              <Route path="admin">
                <Route path="members" element={<RC element={<Members />} />} />
                <Route index element={<RC element={<ProjectAdmin />} />} />
              </Route>
              <Route index element={<RC element={<Project />} />} />
            </Route>
            <Route index element={<RC element={<ProjectList />} />} />
          </Route>
          <Route path="profile" element={<RC element={<Profile />} />} />
          <Route index element={<Home />} />
        </Route>
        <Route
          path="privacy-policy"
          element={<RC isPublic element={<PrivacyPolicy />} />}
        />
        <Route
          path="terms-of-use"
          element={<RC isPublic element={<TermsOfUse />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
