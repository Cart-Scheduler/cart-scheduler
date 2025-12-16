import { Outlet, Meta, Links, Scripts } from 'react-router';
import { Alert, Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import store from './redux/store';

import { InitApp } from './services/init';

import './assets/scss/index.scss';
import MainListener from './components/MainListener';

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap',
    },
  ];
}
export function Layout({ children }) {
  return (
    <html lang="fi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-height-300 bg-primary position-absolute w-100" />
        <main className="main-content position-relative border-radius-lg max-height-vh-100 h-100">
          <title>{import.meta.env.VITE_TITLE}</title>
          <InitApp>
            <Provider store={store} stabilityCheck="never">
              <MainListener>
                <Container fluid className="py-4">
                  {children}
                </Container>
              </MainListener>
            </Provider>
          </InitApp>
        </main>
        <Scripts />
      </body>
    </html>
  );
}
export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  return (
    <div>
      <Alert variant="danger" className="text-white">
        <h4 className="text-white">Error</h4>
        <pre>{JSON.stringify(error ?? {}, null, 2)}</pre>
      </Alert>
    </div>
  );
}
