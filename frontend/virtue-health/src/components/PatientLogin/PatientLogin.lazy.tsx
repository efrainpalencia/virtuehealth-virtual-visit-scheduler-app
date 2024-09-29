import React, { lazy, Suspense } from 'react';

const LazyPatientLogin = lazy(() => import('./PatientLogin'));

const PatientLogin = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPatientLogin {...props} />
  </Suspense>
);

export default PatientLogin;
