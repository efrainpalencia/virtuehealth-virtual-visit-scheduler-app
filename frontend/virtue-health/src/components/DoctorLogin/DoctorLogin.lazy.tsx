import React, { lazy, Suspense } from 'react';

const LazyDoctorLogin = lazy(() => import('./DoctorLogin'));

const DoctorLogin = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyDoctorLogin {...props} />
  </Suspense>
);

export default DoctorLogin;
