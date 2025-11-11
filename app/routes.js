import { route, layout, index, prefix } from '@react-router/dev/routes';

export const DEFAULT_PATH = '/';

export default [
  layout('./layouts/SignIn.jsx', [
    index('./routes/seppo.jsx'),
    ...prefix('signin', [
      //index('./routes/signin/page.jsx'),
      index('./routes/signin/page.jsx'),
      route('link', './routes/signin/Link.jsx'),
    ]),
  ]),
];
