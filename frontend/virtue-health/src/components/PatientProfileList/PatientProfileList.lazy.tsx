import React, { lazy, Suspense } from 'react';

const LazyPatientProfileList = lazy(() => import('./PatientProfileList'));

const PatientProfileList = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPatientProfileList {...props} />
  </Suspense>
);

export default PatientProfileList;
