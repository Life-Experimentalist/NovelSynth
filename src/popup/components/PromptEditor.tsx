import React, { useState } from "react";
import {
  Card,
  Select,
  Input,
  Button,
  Space,
  Typography,
  message,
  Tabs,
} from "antd";
import { SaveOutlined, ReloadOutlined } from "@ant-design/icons";
import { useExtensionStore } from "@/store";
import { featureRegistry } from "@/features/registry";
import type { ContentMode } from "@/types";

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Option } = Select;

const PromptEditor: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<ContentMode>("general");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");

  const { prompts, updatePrompt } = useExtensionStore();

  const allFeatures = featureRegistry.getAll();
  const selectedFeatureData = featureRegistry.get(selectedFeature);

  const handleFeatureChange = (featureId: string) => {
    setSelectedFeature(featureId);
    const feature = featureRegistry.get(featureId);
    if (feature) {
      // Reset to first supported mode
      const firstMode = feature.supportedModes[0] || "general";
      setSelectedMode(firstMode);

      // Load custom prompt or default
      const customPrompt = prompts[featureId]?.[firstMode];
      const defaultPrompt = feature.defaultPrompts[firstMode];
      setCurrentPrompt(customPrompt || defaultPrompt || "");
    }
  };

  const handleModeChange = (mode: ContentMode) => {
    setSelectedMode(mode);
    if (selectedFeatureData) {
      const customPrompt = prompts[selectedFeature]?.[mode];
      const defaultPrompt = selectedFeatureData.defaultPrompts[mode];
      setCurrentPrompt(customPrompt || defaultPrompt || "");
    }
  };

  const handleSave = () => {
    if (!selectedFeature || !selectedMode) {
      message.error("Please select a feature and mode");
      return;
    }

    updatePrompt(selectedFeature, selectedMode, currentPrompt);
    message.success("Prompt saved successfully");
  };

  const handleReset = () => {
    if (selectedFeatureData) {
      const defaultPrompt = selectedFeatureData.defaultPrompts[selectedMode];
      setCurrentPrompt(defaultPrompt || "");
      message.info("Prompt reset to default");
    }
  };

  const contentModes: { value: ContentMode; label: string }[] = [
    { value: "novel", label: "Novel" },
    { value: "article", label: "Article" },
    { value: "news", label: "News" },
    { value: "educational", label: "Educational" },
    { value: "code", label: "Code" },
    { value: "general", label: "General" },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Card size="small">
        <Title level={5}>Prompt Editor</Title>
        <Text type="secondary">
          Customize prompts for each feature and content type
        </Text>
      </Card>

      <Card size="small">
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text strong>Feature:</Text>
            <Select
              style={{ width: "100%", marginTop: 8 }}
              placeholder="Select a feature"
              value={selectedFeature}
              onChange={handleFeatureChange}
            >
              {allFeatures.map((feature) => (
                <Option key={feature.id} value={feature.id}>
                  {feature.icon} {feature.name}
                </Option>
              ))}
            </Select>
          </div>

          {selectedFeatureData && (
            <div>
              <Text strong>Content Type:</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                value={selectedMode}
                onChange={handleModeChange}
              >
                {contentModes
                  .filter((mode) =>
                    selectedFeatureData.supportedModes.includes(mode.value)
                  )
                  .map((mode) => (
                    <Option key={mode.value} value={mode.value}>
                      {mode.label}
                    </Option>
                  ))}
              </Select>
            </div>
          )}

          {selectedFeature && selectedMode && (
            <div>
              <Text strong>Prompt:</Text>
              <TextArea
                style={{ marginTop: 8 }}
                rows={8}
                placeholder="Enter your custom prompt..."
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
              />

              <Space
                style={{
                  marginTop: 8,
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  size="small"
                >
                  Reset to Default
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  size="small"
                >
                  Save Changes
                </Button>
              </Space>
            </div>
          )}
        </Space>
      </Card>

      {selectedFeatureData && (
        <Card size="small">
          <Title level={5}>Feature Info</Title>
          <Space direction="vertical">
            <Text>
              <strong>Description:</strong> {selectedFeatureData.description}
            </Text>
            <Text>
              <strong>Category:</strong> {selectedFeatureData.category}
            </Text>
            <Text>
              <strong>Supported Modes:</strong>{" "}
              {selectedFeatureData.supportedModes.join(", ")}
            </Text>
          </Space>
        </Card>
      )}
    </Space>
  );
};

export default PromptEditor;
