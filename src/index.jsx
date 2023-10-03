import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Root, {
  loader as rootLoader,
  action as rootAction,
} from './routes/root';
import ErrorPage from './error-page';
import EditContact, {action as editAction} from "./routes/edit";
import Contact, {loader as contactLoader,
action as contactAction} from './routes/contact';
import { action as destroyAction } from './routes/destroy';
import Index from './routes/index';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
        ],
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
      {
        path: "contacts/:contactId/destroy",
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>,
      }

    ]
  },

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
