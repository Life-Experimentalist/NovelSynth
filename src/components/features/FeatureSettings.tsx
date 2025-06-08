import React, { useState, useEffect } from "react";
import {
  Card,
  Switch,
  Select,
  Space,
  Tooltip,
  Badge,
  Divider,
  Input,
  Form,
  message,
  Modal,
  Collapse,
  Button,
  Spin,
} from "antd";
import {
  SettingOutlined,
  DragOutlined,
  EditOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useExtension } from "../../contexts/ExtensionContext";
import { FeatureConfig, FeatureCategory } from "../../types/extension";
import { ContentMode, Feature } from "../../types";
import "./FeatureSettings.css";

const { Option } = Select;
const { Panel } = Collapse;

export const FeatureSettings: React.FC = () => {
  const { state, updateFeature } = useExtension();
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshingModels, setRefreshingModels] = useState<
    Record<string, boolean>
  >({});
  const [availableModels, setAvailableModels] = useState<Record<string, any[]>>(
    {}
  );
  const [form] = Form.useForm();

  const enabledFeatures = state.features.filter((f) => f.enabled);
  const disabledFeatures = state.features.filter((f) => !f.enabled);

  const handleFeatureToggle = (feature: FeatureConfig, enabled: boolean) => {
    const updatedFeature = { ...feature, enabled };
    updateFeature(updatedFeature);
    message.success(`${feature.name} ${enabled ? "enabled" : "disabled"}`);
  };

  const handlePriorityChange = (feature: FeatureConfig, priority: number) => {
    const updatedFeature = { ...feature, priority };
    updateFeature(updatedFeature);
  };

  const handleProviderChange = (feature: FeatureConfig, aiProvider: string) => {
    const updatedFeature = { ...feature, defaultAIProvider: aiProvider };
    updateFeature(updatedFeature);
    message.success(`${feature.name} provider updated to ${aiProvider}`);
  };

  const handleModelChange = (feature: FeatureConfig, model: string) => {
    const updatedFeature = { ...feature, defaultModel: model };
    updateFeature(updatedFeature);
    message.success(`${feature.name} model updated to ${model}`);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(enabledFeatures);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update priorities based on new order
    items.forEach((feature, index) => {
      const updatedFeature = { ...feature, priority: index + 1 };
      updateFeature(updatedFeature);
    });
  };

  const openEditModal = (feature: FeatureConfig) => {
    setEditingFeature(feature.id);
    form.setFieldsValue({
      name: feature.name,
      description: feature.description,
      category: feature.category,
      defaultAIProvider: feature.defaultAIProvider,
      defaultModel: feature.defaultModel,
    });
    setIsModalVisible(true);
  };

  const handleEditSave = async () => {
    try {
      const values = await form.validateFields();
      const feature = state.features.find((f) => f.id === editingFeature);

      if (feature) {
        const updatedFeature = { ...feature, ...values };
        updateFeature(updatedFeature);
        message.success("Feature updated successfully!");
      }

      setIsModalVisible(false);
      setEditingFeature(null);
    } catch (error) {
      message.error("Please fill in all required fields.");
    }
  }; // Fetch available models for a provider
  const fetchModelsForProvider = async (providerId: string) => {
    try {
      setRefreshingModels((prev) => ({ ...prev, [providerId]: true }));

      const { serviceRegistry } = await import("../../services/ai/registry");
      const service = serviceRegistry.get(providerId);

      if (service) {
        const models = await service.refreshModels();
        setAvailableModels((prev) => ({ ...prev, [providerId]: models }));
        message.success(`Updated models for ${service.name}`);
      } else {
        message.error(`Service ${providerId} not found`);
      }
    } catch (error) {
      message.error(`Failed to fetch models for ${providerId}`);
      console.error("Model fetch error:", error);
    } finally {
      setRefreshingModels((prev) => ({ ...prev, [providerId]: false }));
    }
  };

  // Initialize models when component mounts
  useEffect(() => {
    const initializeModels = async () => {
      const providers = state.aiProviders.filter((p) => p.enabled && p.apiKey);

      for (const provider of providers) {
        await fetchModelsForProvider(provider.id);
      }
    };

    initializeModels();
  }, [state.aiProviders]);

  const getAvailableModels = (providerId?: string) => {
    if (!providerId) return [];
    return availableModels[providerId] || [];
  };

  const getModelsForMode = (providerId: string, mode: ContentMode) => {
    const models = getAvailableModels(providerId);
    return models.filter(
      (model) => model.supportedModes && model.supportedModes.includes(mode)
    );
  };
  // Handle per-mode model selection
  const handleModeModelChange = (
    feature: FeatureConfig,
    mode: ContentMode,
    modelId: string
  ) => {
    const updatedFeature = {
      ...feature,
      modelPreferences: {
        ...feature.modelPreferences,
        [mode]: modelId,
      },
    };
    updateFeature(updatedFeature);
    message.success(`${feature.name} model for ${mode} updated to ${modelId}`);
  };
  const renderAdvancedModelSelection = (feature: FeatureConfig) => {
    if (!feature.defaultAIProvider) return null;

    const models = getAvailableModels(feature.defaultAIProvider);
    const isRefreshing = refreshingModels[feature.defaultAIProvider];

    return (
      <Collapse ghost>
        <Panel
          header={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>📊 Advanced Model Settings</span>
              <Button
                size="small"
                icon={<ReloadOutlined spin={isRefreshing} />}
                onClick={(e) => {
                  e.stopPropagation();
                  fetchModelsForProvider(feature.defaultAIProvider!);
                }}
                disabled={isRefreshing}
              >
                Refresh Models
              </Button>
            </div>
          }
          key="advanced"
        >
          <div className="advanced-model-config">
            <div className="model-section">
              <h4>🎯 Default Model</h4>
              <Select
                value={feature.defaultModel}
                onChange={(model) => {
                  const updatedFeature = {
                    ...feature,
                    defaultModel: model,
                  };
                  updateFeature(updatedFeature);
                }}
                style={{ width: "100%" }}
                placeholder="Select default model"
                loading={isRefreshing}
              >
                {models.map((model) => (
                  <Option key={model.id} value={model.id}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{model.name}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {model.description} • Max tokens:{" "}
                        {model.maxTokens?.toLocaleString() || "N/A"}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div className="model-section">
              <h4>🎨 Per-Content-Type Models</h4>
              <div className="mode-models">
                {feature.supportedModes?.map((mode: string) => {
                  const modeModels = getModelsForMode(
                    feature.defaultAIProvider!,
                    mode as ContentMode
                  );
                  const currentModel =
                    feature.modelPreferences?.[mode] || feature.defaultModel;

                  return (
                    <div key={mode} className="mode-model-row">
                      <div className="mode-label">
                        <Badge
                          color={getModeColor(mode as ContentMode)}
                          text={mode.toUpperCase()}
                        />
                      </div>
                      <Select
                        value={currentModel}
                        onChange={(modelId) =>
                          handleModeModelChange(
                            feature,
                            mode as ContentMode,
                            modelId
                          )
                        }
                        style={{ width: 200 }}
                        placeholder={`Model for ${mode}`}
                        size="small"
                      >
                        {modeModels.map((model) => (
                          <Option key={model.id} value={model.id}>
                            {model.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Panel>
      </Collapse>
    );
  };

  const getModeColor = (mode: ContentMode): string => {
    const colors: Record<ContentMode, string> = {
      novel: "#52c41a",
      article: "#1890ff",
      news: "#fa8c16",
      educational: "#722ed1",
      code: "#13c2c2",
      general: "#666666",
    };
    return colors[mode] || "#666666";
  };

  const getCategoryColor = (category: FeatureCategory) => {
    const colors = {
      [FeatureCategory.ENHANCEMENT]: "blue",
      [FeatureCategory.ANALYSIS]: "green",
      [FeatureCategory.UTILITY]: "orange",
      [FeatureCategory.TRANSLATION]: "purple",
    };
    return colors[category];
  };

  const renderFeatureCard = (
    feature: FeatureConfig,
    index: number,
    isDraggable = false
  ) => {
    const availableModels = getAvailableModels(feature.defaultAIProvider);

    const cardContent = (
      <Card
        size="small"
        className={`feature-card ${feature.enabled ? "enabled" : "disabled"}`}
        actions={[
          <Tooltip title="Edit Feature">
            <EditOutlined onClick={() => openEditModal(feature)} />
          </Tooltip>,
          <Tooltip title={feature.enabled ? "Disable" : "Enable"}>
            <Switch
              size="small"
              checked={feature.enabled}
              onChange={(enabled) => handleFeatureToggle(feature, enabled)}
            />
          </Tooltip>,
        ]}
      >
        <div className="feature-card-content">
          <div className="feature-header">
            <div className="feature-title">
              <span className="feature-icon">{feature.icon}</span>
              <span className="feature-name">{feature.name}</span>
              <Badge
                color={getCategoryColor(feature.category)}
                text={feature.category}
                size="small"
              />
            </div>
            {isDraggable && <DragOutlined className="drag-handle" />}
          </div>

          <div className="feature-description">{feature.description}</div>

          <div className="feature-config">
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div className="config-row">
                <span className="config-label">Priority:</span>
                <Select
                  size="small"
                  value={feature.priority}
                  onChange={(priority) =>
                    handlePriorityChange(feature, priority)
                  }
                  style={{ width: 80 }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <Option key={num} value={num}>
                      {num}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="config-row">
                <span className="config-label">AI Provider:</span>
                <Select
                  size="small"
                  value={feature.defaultAIProvider}
                  onChange={(provider) =>
                    handleProviderChange(feature, provider)
                  }
                  style={{ width: 120 }}
                  placeholder="Select provider"
                >
                  {state.aiProviders
                    .filter((p) => p.enabled && p.apiKey)
                    .map((provider) => (
                      <Option key={provider.id} value={provider.id}>
                        {provider.displayName}
                      </Option>
                    ))}
                </Select>
              </div>

              {feature.defaultAIProvider && availableModels.length > 0 && (
                <div className="config-row">
                  <span className="config-label">Model:</span>
                  <Select
                    size="small"
                    value={feature.defaultModel}
                    onChange={(model) => handleModelChange(feature, model)}
                    style={{ width: 150 }}
                    placeholder="Select model"
                  >
                    {availableModels.map((model) => (
                      <Option key={model.id} value={model.id}>
                        {model.displayName}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="config-row">
                <span className="config-label">Content Types:</span>
                <div className="content-types">
                  {feature.supportedContentTypes.map((type) => (
                    <Badge key={type} count={type} size="small" />
                  ))}
                </div>
              </div>

              {renderAdvancedModelSelection(feature)}
            </Space>
          </div>
        </div>
      </Card>
    );

    if (isDraggable) {
      return (
        <Draggable key={feature.id} draggableId={feature.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="draggable-feature"
            >
              {cardContent}
            </div>
          )}
        </Draggable>
      );
    }

    return cardContent;
  };

  return (
    <div className="feature-settings">
      <div className="settings-header">
        <div className="header-title">
          <SettingOutlined />
          <span>Feature Configuration</span>
        </div>
        <div className="header-info">
          <InfoCircleOutlined />
          <span>Drag to reorder • Top 2 features shown as buttons</span>
        </div>
      </div>

      {enabledFeatures.length > 0 && (
        <div className="enabled-features">
          <div className="section-title">
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            <span>Enabled Features</span>
            <Badge count={enabledFeatures.length} showZero />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="enabled-features">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="features-list"
                >
                  {enabledFeatures
                    .sort((a, b) => a.priority - b.priority)
                    .map((feature, index) =>
                      renderFeatureCard(feature, index, true)
                    )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {disabledFeatures.length > 0 && (
        <>
          <Divider />
          <div className="disabled-features">
            <div className="section-title">
              <span>Disabled Features</span>
              <Badge count={disabledFeatures.length} showZero />
            </div>
            <div className="features-list">
              {disabledFeatures.map((feature, index) =>
                renderFeatureCard(feature, index, false)
              )}
            </div>
          </div>
        </>
      )}

      <Modal
        title="Edit Feature"
        open={isModalVisible}
        onOk={handleEditSave}
        onCancel={() => setIsModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Feature Name"
            name="name"
            rules={[{ required: true, message: "Please enter feature name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select>
              {Object.values(FeatureCategory).map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Default AI Provider" name="defaultAIProvider">
            <Select placeholder="Select default provider">
              {state.aiProviders
                .filter((p) => p.enabled)
                .map((provider) => (
                  <Option key={provider.id} value={provider.id}>
                    {provider.displayName}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Default Model" name="defaultModel">
            <Select placeholder="Select default model">
              {getAvailableModels(form.getFieldValue("defaultAIProvider")).map(
                (model) => (
                  <Option key={model.id} value={model.id}>
                    {model.displayName}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
