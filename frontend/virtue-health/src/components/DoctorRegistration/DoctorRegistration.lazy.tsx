import React, { lazy, Suspense } from 'react';

const LazyDoctorRegistration = lazy(() => import('./DoctorRegistration'));

const DoctorRegistration = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyDoctorRegistration {...props} />
  </Suspense>
);

export default DoctorRegistration;
