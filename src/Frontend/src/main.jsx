import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './Components/routes';
import { YapProvider } from './Components/Context';
import './index.css';

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <YapProvider>
      <RouterProvider router={router} />
    </YapProvider>
  </React.StrictMode>
);