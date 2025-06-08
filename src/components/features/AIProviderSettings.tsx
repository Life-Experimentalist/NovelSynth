import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Space,
  Alert,
  Divider,
  Badge,
  message,
} from "antd";
import {
  ApiOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useExtension } from "../../contexts/ExtensionContext";
import {
  AIProviderConfig,
  AIModel,
  ModelCapability,
} from "../../types/extension";
import { AIModel as ServiceAIModel } from "../../types/index";
import "./AIProviderSettings.css";

const { Option } = Select;
const { Password } = Input;

export const AIProviderSettings: React.FC = () => {
  const { state, updateAIProvider } = useExtension();
  const [form] = Form.useForm();
  const [selectedProvider, setSelectedProvider] = useState<string>("gemini");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<
    "success" | "error" | null
  >(null);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [detailedError, setDetailedError] = useState<string>("");

  const currentProvider = state.aiProviders.find(
    (p) => p.id === selectedProvider
  );

  const providerOptions = useMemo(() => {
    return state.aiProviders.map((provider) => ({
      ...provider,
      status: getProviderStatus(provider),
    }));
  }, [state.aiProviders]);

  useEffect(() => {
    if (currentProvider) {
      form.setFieldsValue({
        enabled: currentProvider.enabled,
        apiKey: currentProvider.apiKey,
        baseUrl: currentProvider.baseUrl,
        selectedModels: currentProvider.models.map((m) => m.id),
      });
      setAvailableModels(currentProvider.models);
    }
  }, [currentProvider, form]);

  const validateApiKey = useCallback(
    async (apiKey: string, providerId: string) => {
      if (!apiKey?.trim()) {
        message.error("Please enter an API key");
        return;
      }

      setIsValidating(true);
      setValidationStatus(null);
      setConnectionStatus("testing");
      setDetailedError("");

      try {
        const isValid = await validateProviderApiKey(providerId, apiKey);

        if (isValid) {
          setValidationStatus("success");
          setConnectionStatus("success");
          message.success("API key validated successfully!");

          const modelsPromise = loadAvailableModels(providerId, apiKey);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Model loading timeout")), 30000)
          );

          await Promise.race([modelsPromise, timeoutPromise]);
        } else {
          setValidationStatus("error");
          setConnectionStatus("error");
          setDetailedError("Invalid API key format or unauthorized access");
          message.error("Invalid API key. Please check and try again.");
        }
      } catch (error) {
        setValidationStatus("error");
        setConnectionStatus("error");

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setDetailedError(errorMessage);

        // Provide specific user-friendly error messages
        if (errorMessage.includes("Invalid API key")) {
          message.error(
            "❌ Invalid API key: Please check your key format and try again."
          );
        } else if (errorMessage.includes("Permission denied")) {
          message.error(
            "🚫 Permission denied: Your API key doesn't have required permissions."
          );
        } else if (errorMessage.includes("Quota exceeded")) {
          message.error(
            "📊 Quota exceeded: You've reached your API usage limit."
          );
        } else if (errorMessage.includes("Rate limit exceeded")) {
          message.error(
            "⏱️ Rate limit exceeded: Too many requests, please wait and try again."
          );
        } else if (errorMessage.includes("Network error")) {
          message.error(
            "🌐 Network error: Unable to connect to the API service."
          );
        } else if (errorMessage.includes("timeout")) {
          message.error(
            "⏰ Request timeout: Please check your internet connection and try again."
          );
        } else {
          message.error(`💥 Validation failed: ${errorMessage}`);
        }

        console.error("API key validation error:", error);
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  const loadAvailableModels = useCallback(
    async (providerId: string, apiKey: string) => {
      setIsLoadingModels(true);

      try {
        const models = await fetchAvailableModels(providerId, apiKey);
        setAvailableModels(models);

        if (models.length > 0) {
          const defaultSelection = models.slice(0, 2).map((m) => m.id);
          form.setFieldsValue({ selectedModels: defaultSelection });
        }
      } catch (error) {
        console.error("Failed to load models:", error);
        message.error(
          "Failed to load available models. Using fallback options."
        );

        if (providerId === "gemini") {
          const fallbackModels = [
            {
              id: "gemini-1.5-flash",
              name: "gemini-1.5-flash",
              displayName: "Gemini 1.5 Flash",
              maxTokens: 1048576,
              capabilities: [ModelCapability.TEXT_GENERATION],
            },
          ];
          setAvailableModels(fallbackModels);
        }
      } finally {
        setIsLoadingModels(false);
      }
    },
    [form]
  );

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    setValidationStatus(null);
    form.resetFields();
  };

  const handleSaveProvider = async () => {
    try {
      const values = await form.validateFields();

      if (!currentProvider) return;

      const updatedProvider: AIProviderConfig = {
        ...currentProvider,
        enabled: values.enabled,
        apiKey: values.apiKey,
        baseUrl: values.baseUrl,
        models: availableModels.filter((model) =>
          values.selectedModels?.includes(model.id)
        ),
      };

      updateAIProvider(updatedProvider);
      message.success(
        `${currentProvider.displayName} settings saved successfully!`
      );
    } catch (error) {
      message.error("Please fill in all required fields.");
    }
  };

  const getProviderStatus = (provider: AIProviderConfig) => {
    if (!provider.enabled) return { status: "default", text: "Disabled" };
    if (!provider.apiKey) return { status: "warning", text: "No API Key" };
    return { status: "success", text: "Active" };
  };

  const renderProviderCard = (provider: AIProviderConfig) => {
    const status = getProviderStatus(provider);
    const isSelected = selectedProvider === provider.id;

    return (
      <Card
        key={provider.id}
        size="small"
        className={`provider-card ${isSelected ? "selected" : ""}`}
        onClick={() => handleProviderChange(provider.id)}
        hoverable
      >
        <div className="provider-card-content">
          <div className="provider-info">
            <div className="provider-name">{provider.displayName}</div>
            <div className="provider-models">
              {provider.models.length} model
              {provider.models.length !== 1 ? "s" : ""} available
            </div>
          </div>
          <Badge
            status={status.status as any}
            text={status.text}
            className="provider-status-badge"
          />
        </div>
      </Card>
    );
  };

  const renderProviderForm = () => {
    if (!currentProvider) return null;

    return (
      <Form form={form} layout="vertical" className="provider-form">
        <Form.Item name="enabled" valuePropName="checked">
          <div className="provider-toggle">
            <Switch />
            <span>Enable {currentProvider.displayName}</span>
          </div>
        </Form.Item>

        <Form.Item
          label="API Key"
          name="apiKey"
          rules={[{ required: true, message: "Please enter your API key" }]}
          extra={`Get your API key from ${currentProvider.displayName} developer console`}
        >
          <div className="api-key-input">
            <Password
              placeholder={`Enter your ${currentProvider.displayName} API key`}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              suffix={
                validationStatus === "success" ? (
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                ) : validationStatus === "error" ? (
                  <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                ) : null
              }
            />
            <Button
              type="primary"
              size="small"
              loading={isValidating}
              onClick={() => {
                const apiKey = form.getFieldValue("apiKey");
                if (apiKey) {
                  validateApiKey(apiKey, currentProvider.id);
                }
              }}
              disabled={!form.getFieldValue("apiKey")}
            >
              Validate
            </Button>
          </div>
        </Form.Item>

        {currentProvider.baseUrl && (
          <Form.Item
            label="Base URL"
            name="baseUrl"
            extra="Custom endpoint URL (optional)"
          >
            <Input placeholder={currentProvider.baseUrl} />
          </Form.Item>
        )}

        <Form.Item
          label="Available Models"
          name="selectedModels"
          rules={[
            { required: true, message: "Please select at least one model" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select models to use"
            loading={isLoadingModels}
            disabled={!validationStatus || isLoadingModels}
            optionLabelProp="label"
          >
            {availableModels.map((model) => (
              <Option key={model.id} value={model.id} label={model.displayName}>
                <div className="model-option">
                  <div className="model-name">{model.displayName}</div>
                  <div className="model-details">
                    Max tokens: {model.maxTokens.toLocaleString()}
                    {model.costPerToken && ` • $${model.costPerToken}/token`}
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              onClick={handleSaveProvider}
              disabled={!validationStatus || validationStatus === "error"}
            >
              Save Settings
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className="ai-provider-settings">
      <div className="settings-header">
        <div className="header-title">
          <ApiOutlined />
          <span>AI Provider Configuration</span>
        </div>
        <Alert
          message="Configure your AI providers to start using NovelSynth features"
          type="info"
          showIcon
          closable
        />
      </div>

      <div className="provider-selection">
        <div className="section-title">Select Provider</div>
        <div className="provider-cards">
          {providerOptions.map(renderProviderCard)}
        </div>
      </div>

      <Divider />

      {currentProvider && (
        <div className="provider-configuration">
          <div className="section-title">
            Configure {currentProvider.displayName}
          </div>
          {renderProviderForm()}
        </div>
      )}
    </div>
  );
};

// Real API validation using the service registry
async function validateProviderApiKey(
  providerId: string,
  apiKey: string
): Promise<boolean> {
  try {
    const { serviceRegistry } = await import("../../services/ai/registry");
    const service = serviceRegistry.get(providerId);

    if (!service) {
      console.error(`Service not found: ${providerId}`);
      return false;
    }

    return await service.validateApiKey(apiKey);
  } catch (error) {
    console.error(`API key validation error for ${providerId}:`, error);
    return false;
  }
}

async function fetchAvailableModels(
  providerId: string,
  _apiKey: string
): Promise<AIModel[]> {
  try {
    const { serviceRegistry } = await import("../../services/ai/registry");
    const service = serviceRegistry.get(providerId);

    if (!service) {
      console.error(`Service not found: ${providerId}`);
      return [];
    }

    const serviceModels: ServiceAIModel[] = await service.getModels();

    return serviceModels.map(
      (model): AIModel => ({
        id: model.id,
        name: model.name,
        displayName: model.description || model.name,
        maxTokens: model.maxTokens || 4096,
        capabilities: [
          ModelCapability.TEXT_GENERATION,
          ModelCapability.SUMMARIZATION,
          ModelCapability.ANALYSIS,
          ModelCapability.TRANSLATION,
        ],
      })
    );
  } catch (error) {
    console.error(`Failed to fetch models for ${providerId}:`, error);

    if (providerId === "gemini") {
      return [
        {
          id: "gemini-1.5-flash",
          name: "gemini-1.5-flash",
          displayName: "Gemini 1.5 Flash",
          maxTokens: 1048576,
          capabilities: [
            ModelCapability.TEXT_GENERATION,
            ModelCapability.SUMMARIZATION,
            ModelCapability.ANALYSIS,
            ModelCapability.TRANSLATION,
          ],
        },
        {
          id: "gemini-1.5-pro",
          name: "gemini-1.5-pro",
          displayName: "Gemini 1.5 Pro",
          maxTokens: 2097152,
          capabilities: [
            ModelCapability.TEXT_GENERATION,
            ModelCapability.SUMMARIZATION,
            ModelCapability.ANALYSIS,
            ModelCapability.TRANSLATION,
          ],
        },
      ];
    }

    return [];
  }
}
