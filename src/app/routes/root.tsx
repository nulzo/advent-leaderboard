import { Outlet } from 'react-router-dom';

import { MainLayout } from '@/components/layout/main-layout';

export const AppRoot = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const AppRootErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};