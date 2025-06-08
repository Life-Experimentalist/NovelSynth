import React from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Dropdown,
  MenuProps,
  Empty,
  Spin,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useExtensionStore } from "@/store";
import { featureRegistry } from "@/features/registry";

const { Text, Title } = Typography;

interface FeatureListProps {
  onFeatureClick: (featureId: string) => void;
  loading: boolean;
}

const FeatureList: React.FC<FeatureListProps> = ({
  onFeatureClick,
  loading,
}) => {
  const { ui, services } = useExtensionStore();

  const allFeatures = featureRegistry.getAll();
  const recentFeatures = allFeatures.filter((feature) =>
    ui.recentFeatures.includes(feature.id)
  );
  const otherFeatures = allFeatures.filter(
    (feature) => !ui.recentFeatures.includes(feature.id)
  );

  // Check if any service is configured
  const hasConfiguredService = Object.values(services).some(
    (config) => config.isConfigured
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading features...</div>
      </div>
    );
  }

  if (!hasConfiguredService) {
    return (
      <Empty
        description="No AI service configured"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Text type="secondary">
          Please configure an AI service in the Services tab to use features.
        </Text>
      </Empty>
    );
  }

  const getDropdownItems = (): MenuProps["items"] => {
    return otherFeatures.map((feature) => ({
      key: feature.id,
      label: (
        <Space>
          <span>{feature.icon}</span>
          <span>{feature.name}</span>
        </Space>
      ),
      onClick: () => onFeatureClick(feature.id),
    }));
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      {/* Recent Features */}
      {recentFeatures.length > 0 && (
        <Card size="small">
          <Title level={5}>Quick Access</Title>
          <div className="feature-grid">
            {recentFeatures.slice(0, 2).map((feature) => (
              <Button
                key={feature.id}
                className="feature-button"
                onClick={() => onFeatureClick(feature.id)}
                type="primary"
              >
                <div className="feature-icon">{feature.icon}</div>
                <div>{feature.name}</div>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* All Features */}
      <Card size="small">
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Title level={5}>All Features</Title>
          {otherFeatures.length > 0 && (
            <Dropdown
              menu={{ items: getDropdownItems() }}
              placement="bottomRight"
            >
              <Button type="text" icon={<MoreOutlined />} size="small" />
            </Dropdown>
          )}
        </Space>

        <div className="feature-grid">
          {allFeatures.slice(0, 6).map((feature) => (
            <Button
              key={feature.id}
              className="feature-button"
              onClick={() => onFeatureClick(feature.id)}
              type={recentFeatures.includes(feature) ? "primary" : "default"}
            >
              <div className="feature-icon">{feature.icon}</div>
              <div>{feature.name}</div>
            </Button>
          ))}
        </div>

        {allFeatures.length === 0 && (
          <Empty
            description="No features available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      {/* Feature Categories */}
      <Card size="small">
        <Title level={5}>Categories</Title>
        <Space wrap>
          {["enhance", "analyze", "transform", "utility"].map((category) => {
            const categoryFeatures = featureRegistry.getByCategory(
              category as any
            );
            return (
              <Button
                key={category}
                size="small"
                type="text"
                disabled={categoryFeatures.length === 0}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} (
                {categoryFeatures.length})
              </Button>
            );
          })}
        </Space>
      </Card>
    </Space>
  );
};

export default FeatureList;
