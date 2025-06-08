import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Dropdown,
  Space,
  Select,
  Input,
  Tabs,
  Badge,
  Tooltip,
} from "antd";
import {
  SettingOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  BulbOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useExtension } from "../../contexts/ExtensionContext";
import { ContentType } from "../../types/extension";
import { AIProviderSettings } from "./AIProviderSettings";
import { FeatureSettings } from "./FeatureSettings";
import { PromptEditor } from "./PromptEditor";
import "./MainPopup.css";

const { Option } = Select;

interface MainPopupProps {
  onClose?: () => void;
}

export const MainPopup: React.FC<MainPopupProps> = ({ onClose }) => {
  const {
    getEnabledFeatures,
    getTopPriorityFeatures,
    updateUIState,
    executeFeature,
    getActiveAIProvider,
  } = useExtension();

  const [activeTab, setActiveTab] = useState("features");
  const [selectedContent, setSelectedContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.GENERAL
  );
  const [processingFeature, setProcessingFeature] = useState<string | null>(
    null
  );

  const enabledFeatures = getEnabledFeatures();
  const topFeatures = getTopPriorityFeatures(2); // Show top 2 as buttons
  const dropdownFeatures = enabledFeatures.slice(2); // Rest in dropdown
  const activeProvider = getActiveAIProvider();

  // Auto-detect content type and selected text
  useEffect(() => {
    // This will be implemented to detect content from the current page
    detectContentFromPage();
  }, []);

  const detectContentFromPage = async () => {
    try {
      // Send message to content script to get selected text and content type
      const response = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (response.length > 0) {
        const [tab] = response;
        const result = await chrome.tabs.sendMessage(tab.id!, {
          action: "getSelectedContent",
        });

        if (result) {
          setSelectedContent(result.content || "");
          setContentType(result.contentType || ContentType.GENERAL);
          updateUIState({ activeContentType: result.contentType });
        }
      }
    } catch (error) {
      console.error("Failed to detect content:", error);
    }
  };

  const handleFeatureExecution = async (
    featureId: string,
    customContent?: string
  ) => {
    if (!activeProvider) {
      // Show provider setup modal
      setActiveTab("providers");
      return;
    }

    const feature = enabledFeatures.find((f) => f.id === featureId);
    if (!feature) return;

    setProcessingFeature(featureId);

    try {
      const execution = {
        featureId,
        contentType,
        selectedContent: customContent || selectedContent,
        aiProvider: feature.defaultAIProvider || activeProvider.id,
        model: feature.defaultModel || activeProvider.models[0]?.id,
        promptTemplate: feature.promptTemplates[0]?.id,
        variables: { content: customContent || selectedContent },
      };

      const result = await executeFeature(execution);

      if (result.success) {
        // Show result in floating panel or inject into page
        showFeatureResult(result);
      }
    } catch (error) {
      console.error("Feature execution failed:", error);
    } finally {
      setProcessingFeature(null);
    }
  };

  const showFeatureResult = (result: any) => {
    // This will be implemented to show results
    console.log("Feature result:", result);
  };

  const getFeatureDropdownItems = () => {
    return dropdownFeatures.map((feature) => ({
      key: feature.id,
      label: (
        <Space>
          <span>{feature.icon}</span>
          <span>{feature.name}</span>
          <Badge size="small" count={feature.category} />
        </Space>
      ),
      onClick: () => handleFeatureExecution(feature.id),
    }));
  };

  const renderFeatureButtons = () => (
    <div className="feature-buttons">
      <div className="primary-features">
        {topFeatures.map((feature) => (
          <Tooltip key={feature.id} title={feature.description}>
            <Button
              type="primary"
              size="large"
              icon={<span className="feature-icon">{feature.icon}</span>}
              loading={processingFeature === feature.id}
              onClick={() => handleFeatureExecution(feature.id)}
              className="feature-button"
            >
              {feature.name}
            </Button>
          </Tooltip>
        ))}
      </div>

      {dropdownFeatures.length > 0 && (
        <Dropdown
          menu={{ items: getFeatureDropdownItems() }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button size="large" className="more-features-button">
            More Features
            <SettingOutlined />
          </Button>
        </Dropdown>
      )}
    </div>
  );

  const renderContentPreview = () => (
    <Card
      title="Content Preview"
      size="small"
      className="content-preview"
      extra={
        <Select
          value={contentType}
          onChange={setContentType}
          size="small"
          style={{ width: 120 }}
        >
          <Option value={ContentType.NOVEL}>Novel</Option>
          <Option value={ContentType.FANFICTION}>Fanfiction</Option>
          <Option value={ContentType.NEWS}>News</Option>
          <Option value={ContentType.ACADEMIC}>Academic</Option>
          <Option value={ContentType.GENERAL}>General</Option>
        </Select>
      }
    >
      <Input.TextArea
        value={selectedContent}
        onChange={(e) => setSelectedContent(e.target.value)}
        placeholder="Select text on the page or type/paste content here..."
        rows={3}
        maxLength={1000}
        showCount
      />
    </Card>
  );

  const renderProviderStatus = () => (
    <Card size="small" className="provider-status">
      <Space>
        <ApiOutlined />
        <span>Provider:</span>
        {activeProvider ? (
          <Badge color="green" text={activeProvider.displayName} />
        ) : (
          <Badge color="red" text="Not configured" />
        )}
        <Button
          size="small"
          type="link"
          onClick={() => setActiveTab("providers")}
        >
          Configure
        </Button>
      </Space>
    </Card>
  );

  return (
    <div className="main-popup">
      <div className="popup-header">
        <div className="popup-title">
          <ThunderboltOutlined />
          <span>NovelSynth</span>
        </div>
        {onClose && (
          <Button type="text" size="small" onClick={onClose}>
            ×
          </Button>
        )}
      </div>

      <div className="popup-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "features",
              label: (
                <Space>
                  <BulbOutlined />
                  Features
                </Space>
              ),
              children: (
                <div className="features-tab">
                  {renderProviderStatus()}
                  {renderContentPreview()}
                  {renderFeatureButtons()}
                </div>
              ),
            },
            {
              key: "providers",
              label: (
                <Space>
                  <ApiOutlined />
                  AI Providers
                  {!activeProvider && <Badge color="red" />}
                </Space>
              ),
              children: <AIProviderSettings />,
            },
            {
              key: "feature-settings",
              label: (
                <Space>
                  <SettingOutlined />
                  Features
                </Space>
              ),
              children: <FeatureSettings />,
            },
            {
              key: "prompts",
              label: (
                <Space>
                  <GlobalOutlined />
                  Prompts
                </Space>
              ),
              children: <PromptEditor />,
            },
          ]}
        />
      </div>
    </div>
  );
};
