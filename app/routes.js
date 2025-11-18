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
    route('profile', './routes/profile/index.jsx'),
    route('projects', './routes/projects/index.jsx'),
    route(
      'projects/:projectId',
      './routes/projects/project.$projectId/index.jsx',
    ),
    route(
      'projects/:projectId/admin/members',
      './routes/projects/project.$projectId/admin/members/index.jsx',
    ),
    route('join/:projectId', './routes/join.$projectId/index.jsx'),
  ]),
];
