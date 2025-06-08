import React from "react";
import { Alert } from "antd";
import { GlobalOutlined } from "@ant-design/icons";

export const PromptEditor: React.FC = () => {
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <GlobalOutlined />
        <span style={{ fontSize: "16px", fontWeight: 600 }}>
          Prompt Templates
        </span>
      </div>

      <Alert
        message="Coming Soon"
        description="The prompt editor will allow you to customize AI prompts for each feature and content type. This powerful feature will let you fine-tune how AI processes your content."
        type="info"
        showIcon
      />
    </div>
  );
};
