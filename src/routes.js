import { route, layout, index, prefix } from '@react-router/dev/routes';

export const DEFAULT_PATH = '/';

export default [
  layout('./layouts/SignIn.jsx', [
    ...prefix('signin', [
      index('./routes/signin/page.jsx'),
      route('link', './routes/signin/Link.jsx'),
    ]),
    ...prefix('signup', [
      route('password', './routes/signup/password/page.jsx'),
    ]),
    route('signout', './routes/SignOut.jsx'),
  ]),

  index('./routes/Home.jsx'),

  route('profile', './routes/profile/page.jsx'),

  ...prefix('projects', [
    index('./routes/projects/page.jsx'),
    route('new', './routes/projects/new/page.jsx'),
    ...prefix(':projectId', [
      index('./routes/projects/project/page.jsx'),
      route('admin', './routes/projects/project/admin/page.jsx'),
      route(
        'admin/members',
        './routes/projects/project/admin/members/page.jsx',
      ),
    ]),
  ]),

  route('join/:projectId', './routes/join/page.jsx'),

  route('privacy-policy', './routes/PrivacyPolicy.jsx'),
  route('terms-of-use', './routes/TermsOfUse.jsx'),
];
