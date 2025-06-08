// Main popup component for the extension
import React, { useState, useEffect } from "react";
import { Button, Card, Switch, Space, Typography, Divider } from "antd";
import { SettingOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useExtensionStore } from "../store";
import "./Popup.css";

const { Title, Text } = Typography;

export const Popup: React.FC = () => {
  const { ui, services, setFloatingPopupVisible, availableServices } =
    useExtensionStore();

  const [isFloatingEnabled, setIsFloatingEnabled] = useState(
    ui?.floatingPopupEnabled ?? true
  );

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

      <div className="popup-content">
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
                  color: configuredServices.length > 0 ? "#52c41a" : "#ff4d4f",
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

        <Divider style={{ margin: "12px 0" }} />

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

        <div className="popup-footer">
          <Text type="secondary" style={{ fontSize: "11px" }}>
            v1.0.0 - Select text on any page to use AI features
          </Text>
        </div>
      </div>
    </div>
  );
};
