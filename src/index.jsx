import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Root from './routes/root';
import ErrorPage from './error-page';
import Contact from './routes/contact';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: "contacts/:contactId",
    element: <Contact />,
  }

  /*
  {
    path: "users/:userId/profile/gallery/:photoId",
    element: <Contact />,
  }
  */

  // users/1/profile/gallery/10
  // users/2/profile/gallery/20
  // users/rovshan/profile/gallery/avatar

  /*
  const photo = await fetch('https://ali.az/api/getUserPhoto?userId=2&photoId=20');
  */
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
