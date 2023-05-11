import React from 'react';

import RequireAuth from './RequireAuth';
import Spinner from '../components/Spinner';

// Component to be rendered while lazy loading the view
const Loading = () => {
  return (
    <div className="mt-3 d-flex justify-content-center">
      <Spinner />
    </div>
  );
};

// Wrapper for Route element
const RouteContent = ({ authRequired, element, isPublic }) => {
  // lazy loading component
  const lazy = (
    <React.Suspense fallback={<Loading />}>{element}</React.Suspense>
  );

  if (isPublic) {
    return lazy;
  }
  return <RequireAuth>{lazy}</RequireAuth>;
};

export default RouteContent;
