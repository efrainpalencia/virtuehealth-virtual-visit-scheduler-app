import React, { lazy, Suspense } from 'react';

const LazyPatientList = lazy(() => import('./PatientList'));

const PatientList = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPatientList {...props} />
  </Suspense>
);

export default PatientList;
