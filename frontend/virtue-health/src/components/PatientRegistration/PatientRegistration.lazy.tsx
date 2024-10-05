import React, { lazy, Suspense } from 'react';

const LazyPatientRegistration = lazy(() => import('./PatientRegistration'));

const PatientRegistration = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPatientRegistration {...props} />
  </Suspense>
);

export default PatientRegistration;
