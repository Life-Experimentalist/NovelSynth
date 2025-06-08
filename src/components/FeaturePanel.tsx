import React, { useState, useEffect } from "react";
import {
  Card,
  Switch,
  Button,
  Space,
  Typography,
  List,
  message,
  Tooltip,
} from "antd";
import {
  ThunderboltOutlined,
  BulbOutlined,
  FileTextOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useExtensionStore } from "../store";

const { Title, Text } = Typography;

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  requiresAI: boolean;
}

const availableFeatures: Feature[] = [
  {
    id: "summarization",
    name: "Text Summarization",
    description: "Generate AI-powered summaries of content",
    icon: <FileTextOutlined />,
    enabled: true,
    requiresAI: true,
  },
  {
    id: "analysis",
    name: "Content Analysis",
    description: "Analyze writing style, themes, and structure",
    icon: <BulbOutlined />,
    enabled: true,
    requiresAI: true,
  },
  {
    id: "floatingPanel",
    name: "Floating Panel",
    description: "Show floating panel on supported websites",
    icon: <ThunderboltOutlined />,
    enabled: true,
    requiresAI: false,
  },
];

export const FeaturePanel: React.FC = () => {
  const { services, ui, setFloatingPopupVisible } = useExtensionStore();
  const [features, setFeatures] = useState<Feature[]>(availableFeatures);

  const configuredServices = Object.keys(services).filter(
    (serviceId) => services[serviceId]?.isConfigured
  );

  const hasAIServices = configuredServices.length > 0;

  useEffect(() => {
    // Update floating panel feature based on store state
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === "floatingPanel"
          ? { ...feature, enabled: ui?.floatingPopupEnabled ?? true }
          : feature
      )
    );
  }, [ui?.floatingPopupEnabled]);

  const handleFeatureToggle = async (featureId: string, enabled: boolean) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === featureId ? { ...feature, enabled } : feature
      )
    );

    // Handle specific feature logic
    if (featureId === "floatingPanel") {
      setFloatingPopupVisible(enabled);

      // Send message to content script
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab?.id) {
          await chrome.tabs.sendMessage(tab.id, {
            type: "TOGGLE_FLOATING_PANEL",
            enabled,
          });
        }
      } catch (error) {
        console.warn("Could not send message to content script:", error);
      }

      message.success(`Floating panel ${enabled ? "enabled" : "disabled"}`);
    } else if (enabled && !hasAIServices) {
      message.warning("Configure AI services in settings to use this feature");
      setFeatures((prev) =>
        prev.map((feature) =>
          feature.id === featureId ? { ...feature, enabled: false } : feature
        )
      );
    } else {
      message.success(
        `${features.find((f) => f.id === featureId)?.name} ${
          enabled ? "enabled" : "disabled"
        }`
      );
    }
  };

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      {/* Status Card */}
      <Card size="small">
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text strong>AI Services Status</Text>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {hasAIServices ? (
                <>
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  <Text style={{ color: "#52c41a", fontSize: "12px" }}>
                    {configuredServices.length} configured
                  </Text>
                </>
              ) : (
                <>
                  <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                  <Text style={{ color: "#ff4d4f", fontSize: "12px" }}>
                    Not configured
                  </Text>
                </>
              )}
            </div>
          </div>

          {!hasAIServices && (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Configure AI services to enable advanced features
              </Text>
              <br />
              <Button
                type="primary"
                size="small"
                icon={<SettingOutlined />}
                onClick={openSettings}
                style={{ marginTop: 8 }}
              >
                Open Settings
              </Button>
            </div>
          )}
        </Space>
      </Card>

      {/* Features List */}
      <Card size="small" title="Features">
        <List
          size="small"
          dataSource={features}
          renderItem={(feature) => {
            const canUse = !feature.requiresAI || hasAIServices;

            return (
              <List.Item
                style={{
                  padding: "8px 0",
                  opacity: !canUse ? 0.6 : 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Space>
                      {feature.icon}
                      <div>
                        <Text strong style={{ fontSize: "13px" }}>
                          {feature.name}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                          {feature.description}
                        </Text>
                        {feature.requiresAI && !hasAIServices && <br />}
                        {feature.requiresAI && !hasAIServices && (
                          <Text type="warning" style={{ fontSize: "10px" }}>
                            Requires AI service
                          </Text>
                        )}
                      </div>
                    </Space>
                  </div>
                  <Tooltip title={!canUse ? "Configure AI services first" : ""}>
                    <Switch
                      size="small"
                      checked={feature.enabled && canUse}
                      disabled={!canUse}
                      onChange={(enabled) =>
                        handleFeatureToggle(feature.id, enabled)
                      }
                    />
                  </Tooltip>
                </div>
              </List.Item>
            );
          }}
        />
      </Card>
    </Space>
  );
};
