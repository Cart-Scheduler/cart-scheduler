import { route, layout, index, prefix } from '@react-router/dev/routes';

export const DEFAULT_PATH = '/';

export default [
  layout('./layouts/SignIn.jsx', [
    ...prefix('signin', [
      index('./app/signin/page.jsx'),
      route('link', './app/signin/Link.jsx'),
    ]),
    ...prefix('signup', [route('password', './app/signup/password/page.jsx')]),
    route('signout', './app/SignOut.jsx'),
  ]),

  index('./app/Home.jsx'),

  route('profile', './app/profile/page.jsx'),

  ...prefix('projects', [
    index('./app/projects/page.jsx'),
    route('new', './app/projects/new/page.jsx'),
    ...prefix(':projectId', [
      index('./app/projects/project/page.jsx'),
      route('admin', './app/projects/project/admin/page.jsx'),
      route('admin/members', './app/projects/project/admin/members/page.jsx'),
    ]),
  ]),

  route('join/:projectId', './app/join/page.jsx'),

  route('privacy-policy', './app/PrivacyPolicy.jsx'),
  route('terms-of-use', './app/TermsOfUse.jsx'),
];
