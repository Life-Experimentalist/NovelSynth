import React from "react";
import { Card, Button, Space, Typography, List, Tag } from "antd";
import {
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RobotOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useExtensionStore } from "../store";

const { Title, Text } = Typography;

interface ServiceInfo {
  id: string;
  name: string;
  description: string;
  status: "configured" | "not-configured";
}

export const SettingsPanel: React.FC = () => {
  const { services } = useExtensionStore();

  const servicesList: ServiceInfo[] = [
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT models for text analysis and generation",
      status: services.openai?.isConfigured ? "configured" : "not-configured",
    },
    {
      id: "anthropic",
      name: "Anthropic",
      description: "Claude models for content analysis",
      status: services.anthropic?.isConfigured
        ? "configured"
        : "not-configured",
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Google's Gemini models",
      status: services.gemini?.isConfigured ? "configured" : "not-configured",
    },
    {
      id: "ollama",
      name: "Ollama",
      description: "Local AI models via Ollama",
      status: services.ollama?.isConfigured ? "configured" : "not-configured",
    },
  ];

  const configuredCount = servicesList.filter(
    (s) => s.status === "configured"
  ).length;

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  const openExtensionManager = () => {
    chrome.tabs.create({ url: "chrome://extensions/" });
  };

  const openKeyboardShortcuts = () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      {/* Quick Settings */}
      <Card size="small">
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={openOptionsPage}
            size="large"
            style={{ marginBottom: 8 }}
          >
            Open Full Settings
          </Button>
          <br />
          <Text type="secondary" style={{ fontSize: "11px" }}>
            Configure AI services, customize features, and manage preferences
          </Text>
        </div>
      </Card>

      {/* AI Services Status */}
      <Card
        size="small"
        title={
          <Space>
            <RobotOutlined />
            <Text strong>AI Services</Text>
            <Tag color={configuredCount > 0 ? "green" : "orange"}>
              {configuredCount}/{servicesList.length} configured
            </Tag>
          </Space>
        }
      >
        <List
          size="small"
          dataSource={servicesList}
          renderItem={(service) => (
            <List.Item style={{ padding: "6px 0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div>
                  <Text strong style={{ fontSize: "12px" }}>
                    {service.name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "10px" }}>
                    {service.description}
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {service.status === "configured" ? (
                    <>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text style={{ color: "#52c41a", fontSize: "10px" }}>
                        Ready
                      </Text>
                    </>
                  ) : (
                    <>
                      <ExclamationCircleOutlined style={{ color: "#faad14" }} />
                      <Text style={{ color: "#faad14", fontSize: "10px" }}>
                        Setup required
                      </Text>
                    </>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />

        {configuredCount === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "12px 0",
              background: "#fafafa",
              borderRadius: 4,
              marginTop: 8,
            }}
          >
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Configure at least one AI service to use advanced features
            </Text>
          </div>
        )}
      </Card>

      {/* Extension Management */}
      <Card size="small" title="Extension Management">
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          {" "}
          <Button
            type="default"
            icon={<LinkOutlined />}
            onClick={openExtensionManager}
            size="small"
            block
          >
            Manage Extension
          </Button>
          <Button
            type="default"
            icon={<SettingOutlined />}
            onClick={openKeyboardShortcuts}
            size="small"
            block
          >
            Keyboard Shortcuts
          </Button>
        </Space>
      </Card>

      {/* Extension Info */}
      <Card size="small" title="About">
        <Space direction="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Version:
            </Text>
            <Text style={{ fontSize: "11px" }}>2.0.0</Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Last Updated:
            </Text>
            <Text style={{ fontSize: "11px" }}>2024</Text>
          </div>
          <Text
            type="secondary"
            style={{ fontSize: "10px", textAlign: "center" }}
          >
            Enhanced AI-powered tools for web content analysis and interaction
          </Text>
        </Space>
      </Card>
    </Space>
  );
};
