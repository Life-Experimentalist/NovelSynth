import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Button,
  Select,
  Input,
  message,
  Tabs,
  Switch,
  Space,
  Typography,
  Dropdown,
  MenuProps,
} from "antd";
import {
  SettingOutlined,
  ThunderboltOutlined,
  MoreOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useExtensionStore } from "@/store";
import { serviceRegistry } from "@/services/ai/registry";
import { featureRegistry } from "@/features/registry";
import ServiceConfig from "./components/ServiceConfig";
import FeatureList from "./components/FeatureList";
import PromptEditor from "./components/PromptEditor";

const { Header, Content } = Layout;
const { Title } = Typography;

const PopupApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("features");
  const [loading, setLoading] = useState(false);

  const { services, ui, setFloatingPopupVisible, addRecentFeature } =
    useExtensionStore();

  useEffect(() => {
    // Initialize services and features
    const initializeApp = async () => {
      setLoading(true);
      try {
        // Load available services
        const availableServices = serviceRegistry.getAll();

        // Load available features
        const availableFeatures = featureRegistry.getAll();

        console.log("Initialized:", { availableServices, availableFeatures });
      } catch (error) {
        message.error("Failed to initialize extension");
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleFeatureClick = async (featureId: string) => {
    try {
      // Add to recent features
      addRecentFeature(featureId);

      // Send message to content script to execute feature
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: "executeFeature",
          featureId,
        });
      }

      message.success("Feature executed successfully");
    } catch (error) {
      message.error("Failed to execute feature");
      console.error("Feature execution error:", error);
    }
  };

  const tabItems = [
    {
      key: "features",
      label: (
        <Space>
          <ThunderboltOutlined />
          Features
        </Space>
      ),
      children: (
        <FeatureList onFeatureClick={handleFeatureClick} loading={loading} />
      ),
    },
    {
      key: "services",
      label: (
        <Space>
          <SettingOutlined />
          Services
        </Space>
      ),
      children: <ServiceConfig />,
    },
    {
      key: "prompts",
      label: (
        <Space>
          <MoreOutlined />
          Prompts
        </Space>
      ),
      children: <PromptEditor />,
    },
  ];

  return (
    <Layout className="popup-container">
      <Header className="popup-header">
        <Title level={4} style={{ color: "white", margin: 0 }}>
          NovelSynth
        </Title>
        <Space style={{ float: "right" }}>
          <Switch
            size="small"
            checked={ui.floatingPopupEnabled}
            onChange={setFloatingPopupVisible}
            checkedChildren="Float"
            unCheckedChildren="Float"
          />
        </Space>
      </Header>

      <Content className="popup-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="small"
        />
      </Content>
    </Layout>
  );
};

export default PopupApp;
