import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Select,
  Input,
  Button,
  Space,
  message,
  Typography,
  Alert,
  Spin,
  Tooltip,
  Progress,
} from "antd";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useExtensionStore } from "@/store";
import { serviceRegistry } from "@/services/ai/registry";
import type { AIService, AIModel } from "@/types";

const { Text, Title } = Typography;
const { Option } = Select;

const ServiceConfig: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>("gemini");
  const [apiKey, setApiKey] = useState<string>("");
  const [validating, setValidating] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [connectionQuality, setConnectionQuality] = useState<
    "good" | "fair" | "poor" | null
  >(null);
  const [validationProgress, setValidationProgress] = useState(0);

  const {
    services,
    setApiKey: saveApiKey,
    setSelectedModel,
  } = useExtensionStore();

  useEffect(() => {
    // Load existing API key for selected service
    const serviceConfig = services[selectedService];
    if (serviceConfig?.apiKey) {
      setApiKey(serviceConfig.apiKey);
    } else {
      setApiKey("");
    }
  }, [selectedService, services]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    setAvailableModels([]);
  };

  const validateAndSaveApiKey = useCallback(async () => {
    if (!apiKey.trim()) {
      message.error("Please enter an API key");
      return;
    }

    setValidating(true);
    setValidationProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setValidationProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const service = serviceRegistry.get(selectedService);
      if (!service) {
        throw new Error("Service not found");
      }

      // Test connection quality
      const startTime = Date.now();
      const isValid = await service.validateApiKey(apiKey);
      const responseTime = Date.now() - startTime;

      clearInterval(progressInterval);
      setValidationProgress(100);

      if (isValid) {
        // Determine connection quality based on response time
        if (responseTime < 1000) {
          setConnectionQuality("good");
        } else if (responseTime < 3000) {
          setConnectionQuality("fair");
        } else {
          setConnectionQuality("poor");
        }

        saveApiKey(selectedService, apiKey);
        message.success("API key validated and saved");
        await loadModels();
      } else {
        setConnectionQuality(null);
        message.error("Invalid API key");
      }
    } catch (error) {
      setConnectionQuality(null);
      console.error("API key validation error:", error);

      if (error instanceof Error) {
        if (error.message.includes("network")) {
          message.error("Network error. Please check your connection.");
        } else if (error.message.includes("timeout")) {
          message.error("Request timeout. Please try again.");
        } else {
          message.error("Failed to validate API key");
        }
      } else {
        message.error("Failed to validate API key");
      }
    } finally {
      setValidating(false);
      setValidationProgress(0);
    }
  }, [apiKey, selectedService, saveApiKey]);

  const loadModels = useCallback(async () => {
    setLoadingModels(true);
    try {
      const service = serviceRegistry.get(selectedService);
      if (!service) {
        throw new Error("Service not found");
      }

      const models = await service.getModels();
      setAvailableModels(models);

      // Set default model if none selected
      const currentConfig = services[selectedService];
      if (!currentConfig?.selectedModel && models.length > 0) {
        setSelectedModel(selectedService, models[0].id);
        message.info(`Selected default model: ${models[0].name}`);
      }
    } catch (error) {
      console.error("Failed to load models:", error);
      message.error("Failed to load available models");
    } finally {
      setLoadingModels(false);
    }
  }, [selectedService, services, setSelectedModel]);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(selectedService, modelId);
    message.success("Model updated");
  };

  const renderConnectionStatus = () => {
    if (!connectionQuality) return null;

    const statusConfig = {
      good: {
        color: "#52c41a",
        text: "Excellent",
        icon: <CheckCircleOutlined />,
      },
      fair: { color: "#faad14", text: "Good", icon: <InfoCircleOutlined /> },
      poor: {
        color: "#ff4d4f",
        text: "Slow",
        icon: <ExclamationCircleOutlined />,
      },
    };

    const config = statusConfig[connectionQuality];

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: "12px",
          color: config.color,
          marginTop: 4,
        }}
      >
        {config.icon}
        <span>Connection: {config.text}</span>
      </div>
    );
  };

  const availableServices = serviceRegistry.getAll();
  const currentServiceConfig = services[selectedService];
  const isConfigured = currentServiceConfig?.isConfigured;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Card size="small">
        <Title level={5}>AI Service Configuration</Title>

        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text strong>Select Service:</Text>
            <Select
              style={{ width: "100%", marginTop: 8 }}
              value={selectedService}
              onChange={handleServiceChange}
            >
              {availableServices.map((service) => (
                <Option key={service.id} value={service.id}>
                  {service.icon} {service.name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>API Key:</Text>
            <Input.Password
              style={{ marginTop: 8 }}
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              suffix={
                isConfigured ? (
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                ) : null
              }
            />
            <Button
              type="primary"
              style={{ marginTop: 8, width: "100%" }}
              onClick={validateAndSaveApiKey}
              loading={validating}
              disabled={!apiKey.trim()}
            >
              {validating ? (
                <Space>
                  <Spin size="small" />
                  <span>Validating...</span>
                  <Progress
                    percent={validationProgress}
                    size="small"
                    showInfo={false}
                  />
                </Space>
              ) : (
                "Validate & Save"
              )}
            </Button>
            {renderConnectionStatus()}
          </div>

          {isConfigured && (
            <div>
              <Text strong>Model:</Text>
              {loadingModels ? (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Spin indicator={<LoadingOutlined />} />
                  <div>Loading models...</div>
                </div>
              ) : (
                <Select
                  style={{ width: "100%", marginTop: 8 }}
                  placeholder="Select a model"
                  value={currentServiceConfig.selectedModel}
                  onChange={handleModelChange}
                  onDropdownVisibleChange={(open) => {
                    if (open && availableModels.length === 0) {
                      loadModels();
                    }
                  }}
                >
                  {availableModels.map((model) => (
                    <Option key={model.id} value={model.id}>
                      {model.name}
                      {model.description && (
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {model.description}
                        </div>
                      )}
                    </Option>
                  ))}
                </Select>
              )}
            </div>
          )}
        </Space>
      </Card>

      {!isConfigured && (
        <Alert
          message="Service Not Configured"
          description="Please enter and validate your API key to use AI features."
          type="warning"
          showIcon
        />
      )}
    </Space>
  );
};

export default ServiceConfig;
