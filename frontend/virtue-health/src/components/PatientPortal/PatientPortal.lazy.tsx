import React, { lazy, Suspense } from 'react';

const LazyPatientPortal = lazy(() => import('./PatientPortal'));

const PatientPortal = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPatientPortal {...props} />
  </Suspense>
);

export default PatientPortal;
