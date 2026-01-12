import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

import routes from 'frontend/constants/routes';
import { useAccountContext, useAuthContext } from 'frontend/contexts';
import { Dashboard, NotFound } from 'frontend/pages';
import AppLayout from 'frontend/pages/app-layout/app-layout';
import TaskDetailsPage from 'frontend/pages/tasks/task-details-page';
import TasksPage from 'frontend/pages/tasks/tasks-page';
import { AsyncError } from 'frontend/types';

const App = () => {
  const { getAccountDetails } = useAccountContext();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    getAccountDetails().catch((err: AsyncError) => {
      toast.error(err.message);
      logout();
      navigate(routes.LOGIN);
    });
  }, [getAccountDetails, logout, navigate]);

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export const protectedRoutes = [
  {
    path: '',
    element: <App />,
    children: [
      { path: '', element: <Dashboard /> },
      { path: routes.TASKS, element: <TasksPage /> },
      { path: routes.TASK_DETAILS, element: <TaskDetailsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
