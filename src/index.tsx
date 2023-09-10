import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Leaderboard } from "./Leaderboard";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider } from "./Store";
import { RouterProvider, Navigate, createHashRouter } from "react-router-dom";
//import { Bop } from "./Bop";
import { Layout } from "./Layout";
import { Cars } from "./Cars";

const router = createHashRouter([
  {
    path: "/",
    element: <Navigate to="/leaderboard" />,
  },
  {
    path: "/leaderboard/*",
    element: <Leaderboard />,
  },
  {
    path: "/cars/*",
    element: <Cars />,
  },
  /*   {
    path: "/bop/*",
    element: <Bop />,
  }, */
  {
    path: "*",
    element: (
      <Layout>
        <h2>Coming soon</h2>
      </Layout>
    ),
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
