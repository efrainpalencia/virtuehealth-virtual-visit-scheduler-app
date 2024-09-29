import React, { lazy, Suspense } from 'react';

const LazyPasswordReset = lazy(() => import('./PasswordReset'));

const PasswordReset = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPasswordReset {...props} />
  </Suspense>
);

export default PasswordReset;
