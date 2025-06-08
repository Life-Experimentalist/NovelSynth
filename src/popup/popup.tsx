// Main popup entry point for NovelSynth extension
import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import PopupApp from "./PopupApp";
import "./popup.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 8,
        },
      }}
    >
      <PopupApp />
    </ConfigProvider>
  </React.StrictMode>
);
