import React, { useState } from "react";
import { Tabs, Space } from "antd";
import {
  BulbOutlined,
  MessageOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { FeaturePanel } from "../components/FeaturePanel";
import { PromptsPanel } from "../components/PromptsPanel";
import { SettingsPanel } from "../components/SettingsPanel";
import { WebpageDetails } from "../components/WebpageDetails";

const { TabPane } = Tabs;

const PopupApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("features");

  return (
    <div style={{ width: 400, minHeight: 500, padding: 16 }}>
      {/* Always show webpage details at the top */}
      <WebpageDetails style={{ marginBottom: 16 }} />

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="small">
        <TabPane
          tab={
            <Space>
              <BulbOutlined />
              Features
            </Space>
          }
          key="features"
        >
          <FeaturePanel />
        </TabPane>

        <TabPane
          tab={
            <Space>
              <MessageOutlined />
              Prompts
            </Space>
          }
          key="prompts"
        >
          <PromptsPanel />
        </TabPane>

        <TabPane
          tab={
            <Space>
              <SettingOutlined />
              Settings
            </Space>
          }
          key="settings"
        >
          <SettingsPanel />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PopupApp;
