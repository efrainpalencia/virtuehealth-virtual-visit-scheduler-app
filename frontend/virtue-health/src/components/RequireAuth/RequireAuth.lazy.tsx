import React, { lazy, Suspense } from 'react';

const LazyRequireAuth = lazy(() => import('./RequireAuth'));

const RequireAuth = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyRequireAuth {...props} />
  </Suspense>
);

export default RequireAuth;
