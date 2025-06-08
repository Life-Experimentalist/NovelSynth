// Main popup component for the extension
import React, { useState, useEffect } from "react";
import { Button, Card, Switch, Space, Typography, Divider, Tabs } from "antd";
import {
  SettingOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useExtensionStore } from "../store";
import { WebpageDetails } from "./WebpageDetails";
import { FeaturePanel } from "./FeaturePanel";
import "./Popup.css";

const { Title, Text } = Typography;

export const Popup: React.FC = () => {
  const { ui, services, setFloatingPopupVisible, availableServices } =
    useExtensionStore();

  const [isFloatingEnabled, setIsFloatingEnabled] = useState(
    ui?.floatingPopupEnabled ?? true
  );
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setIsFloatingEnabled(ui?.floatingPopupEnabled ?? true);
  }, [ui?.floatingPopupEnabled]);

  const handleFloatingToggle = (enabled: boolean) => {
    setIsFloatingEnabled(enabled);
    setFloatingPopupVisible(enabled);

    // Send message to content script to show/hide floating panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "TOGGLE_FLOATING_PANEL",
          enabled,
        });
      }
    });
  };

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  const configuredServices = Object.keys(services).filter(
    (serviceId) => services[serviceId]?.isConfigured
  );

  const tabItems = [
    {
      key: "overview",
      label: (
        <span>
          <FileTextOutlined />
          Overview
        </span>
      ),
      children: (
        <div className="popup-content">
          {/* Show webpage details at the top */}
          <WebpageDetails
            style={{
              marginBottom: "12px",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
            }}
          />

          <Card size="small" title="Quick Settings">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div className="setting-item">
                <div>
                  <Text strong>Floating Panel</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Show floating panel on supported websites
                  </Text>
                </div>
                <Switch
                  checked={isFloatingEnabled}
                  onChange={handleFloatingToggle}
                  size="small"
                />
              </div>
            </Space>
          </Card>

          <Card size="small" title="Status" style={{ marginTop: 12 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div className="status-item">
                <Text>Configured AI Services:</Text>
                <Text
                  strong
                  style={{
                    color:
                      configuredServices.length > 0 ? "#52c41a" : "#ff4d4f",
                  }}
                >
                  {configuredServices.length > 0
                    ? configuredServices.length
                    : "None"}
                </Text>
              </div>

              {configuredServices.length === 0 && (
                <Text type="warning" style={{ fontSize: "12px" }}>
                  Configure at least one AI service to use features
                </Text>
              )}
            </Space>
          </Card>
        </div>
      ),
    },
    {
      key: "features",
      label: (
        <span>
          <ThunderboltOutlined />
          Features
        </span>
      ),
      children: (
        <div className="popup-content">
          <FeaturePanel />
        </div>
      ),
    },
    {
      key: "settings",
      label: (
        <span>
          <SettingOutlined />
          Settings
        </span>
      ),
      children: (
        <div className="popup-content">
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={openOptionsPage}
              size="small"
            >
              Open Settings
            </Button>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div className="novelsynth-popup">
      <div className="popup-header">
        <div className="popup-title">
          <ThunderboltOutlined className="popup-icon" />
          <Title level={4} style={{ margin: 0 }}>
            NovelSynth
          </Title>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="small"
        centered
        className="popup-tabs"
      />

      <div className="popup-footer">
        <Text type="secondary" style={{ fontSize: "11px" }}>
          v2.0.0 - Enhanced AI features for web content
        </Text>
      </div>
    </div>
  );
};
