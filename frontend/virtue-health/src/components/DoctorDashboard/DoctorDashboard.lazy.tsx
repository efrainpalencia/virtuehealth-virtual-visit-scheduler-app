import React, { lazy, Suspense } from 'react';

const LazyDoctorDashboard = lazy(() => import('./DoctorDashboard'));

const DoctorDashboard = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyDoctorDashboard {...props} />
  </Suspense>
);

export default DoctorDashboard;
