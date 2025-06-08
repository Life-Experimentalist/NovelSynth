import React from "react";
import { Card, Typography, Space, Empty } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const FeaturePanel: React.FC = () => {
  return (
    <div style={{ padding: "12px 0" }}>
      <Card
        size="small"
        title={
          <Space>
            <ThunderboltOutlined />
            <Text strong>AI Features</Text>
          </Space>
        }
      >
        <Empty
          description="Configure AI services in Settings to enable features"
          style={{ margin: "20px 0" }}
        />
      </Card>
    </div>
  );
};
