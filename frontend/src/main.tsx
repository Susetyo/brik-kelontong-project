import React from 'react'
import ReactDOM from 'react-dom/client'
import List from './pages/list';
import Detail from './pages/detail/index';
import ErrorPage from './commons/components/ErrorPage';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";


const engine = new Styletron();

const router = createBrowserRouter([
  {
    path: "/",
    element: <List />,
    errorElement: <ErrorPage />
  },
  {
    path: "/detail/:id",
    element: <Detail />,
    errorElement: <ErrorPage />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  </React.StrictMode>,
)
