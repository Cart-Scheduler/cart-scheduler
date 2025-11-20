import { route, layout, index, prefix } from '@react-router/dev/routes';

export const DEFAULT_PATH = '/';

export default [
  layout('./layouts/SignIn.jsx', [
    ...prefix('signin', [
      index('./routes/signin/page.jsx'),
      route('link', './routes/signin/Link.jsx'),
    ]),
    route('signout', './routes/SignOut.jsx'),
  ]),

  layout('./layouts/Private.jsx', [
    index('./routes/seppo.jsx'),
    route('profile', './routes/profile/page.jsx'),
    route('projects', './routes/projects/page.jsx'),
    route(
      'projects/:projectId',
      './routes/projects/project.$projectId/page.jsx',
    ),
    route(
      'projects/:projectId/admin/members',
      './routes/projects/project.$projectId/admin/members/page.jsx',
    ),
    route('join/:projectId', './routes/join.$projectId/page.jsx'),
    route(
      'projects/:projectId/admin',
      './routes/projects/project.$projectId/admin/page.jsx',
    ),
    route('privacy-policy', './routes/PrivacyPolicy.jsx'),
    route('terms-of-use', './routes/TermsOfUse.jsx'),
  ]),
];
