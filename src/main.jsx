import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { Toaster } from "react-hot-toast";

import "modern-normalize/modern-normalize.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#2a2a2c",
                color: "#fff",
                borderRadius: "10px",
                border: "1px solid #48484a",
              },
            }}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
