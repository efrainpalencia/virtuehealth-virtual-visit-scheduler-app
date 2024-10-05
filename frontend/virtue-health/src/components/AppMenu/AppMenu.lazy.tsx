import React, { lazy, Suspense } from 'react';

const LazyAppMenu = lazy(() => import('./AppMenu'));

const AppMenu = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAppMenu {...props} />
  </Suspense>
);

export default AppMenu;
