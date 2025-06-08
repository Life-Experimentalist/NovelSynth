// filepath: v:\Code\ProjectCode\NovelSynth\src\components\features\FloatingPanel.tsx
// Floating Panel Component for quick access to NovelSynth features
import React, { useState, useEffect } from "react";
import { Button, Tooltip, notification } from "antd";
import {
  CloseOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { useExtensionStore } from "../../store";
import { Feature, ContentMode } from "../../types";
import "./FloatingPanel.css";

interface FloatingPanelProps {
  visible: boolean;
  onClose: () => void;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  visible,
  onClose,
}) => {
  const { addRecentFeature, ui } = useExtensionStore();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock features for now - will be replaced with proper registry
  const mockFeatures: Feature[] = [
    {
      id: "summarize",
      name: "Summarize",
      description: "Create a concise summary",
      icon: "🔍",
      category: "analyze",
      supportedModes: [
        "novel",
        "article",
        "news",
        "educational",
        "code",
        "general",
      ],
      isRecent: false,
      config: {
        serviceId: "gemini",
        modelId: "gemini-pro",
        enabled: true,
        customPrompts: {
          novel: "",
          article: "",
          news: "",
          educational: "",
          code: "",
          general: "",
        },
        customSystemPrompts: {
          novel: "",
          article: "",
          news: "",
          educational: "",
          code: "",
          general: "",
        },
      },
      defaultPrompts: {
        novel:
          "Summarize this novel chapter, highlighting key plot points and character developments:",
        article: "Provide a concise summary of this article:",
        news: "Summarize the key points of this news article:",
        educational: "Summarize this educational content:",
        code: "Explain what this code does:",
        general: "Please summarize the following text:",
      },
      defaultSystemPrompts: {
        novel: "You are a literary assistant specializing in novel analysis.",
        article:
          "You are a helpful assistant that creates clear, informative summaries.",
        news: "You are a news analyst that extracts key information.",
        educational:
          "You are an educational assistant that creates clear summaries.",
        code: "You are a programming assistant that explains code clearly.",
        general: "You are a helpful assistant that creates clear summaries.",
      },
    },
    {
      id: "enhance",
      name: "Enhance",
      description: "Improve text quality",
      icon: "✨",
      category: "enhance",
      supportedModes: [
        "novel",
        "article",
        "news",
        "educational",
        "code",
        "general",
      ],
      isRecent: false,
      config: {
        serviceId: "gemini",
        modelId: "gemini-pro",
        enabled: true,
        customPrompts: {
          novel: "",
          article: "",
          news: "",
          educational: "",
          code: "",
          general: "",
        },
        customSystemPrompts: {
          novel: "",
          article: "",
          news: "",
          educational: "",
          code: "",
          general: "",
        },
      },
      defaultPrompts: {
        novel:
          "Enhance this text while maintaining the author's style and narrative voice:",
        article: "Improve the clarity and flow of this text:",
        news: "Enhance this news content for better readability:",
        educational:
          "Improve this educational content for better understanding:",
        code: "Improve this code with better practices:",
        general: "Please improve the quality and clarity of this text:",
      },
      defaultSystemPrompts: {
        novel: "You are a skilled editor specializing in creative writing.",
        article:
          "You are an experienced editor focused on clear, engaging content.",
        news: "You are a news editor ensuring accuracy and readability.",
        educational:
          "You are an educational content editor focused on clarity.",
        code: "You are a senior developer focused on code quality and best practices.",
        general:
          "You are a helpful writing assistant focused on clarity and quality.",
      },
    },
  ];

  // Get recent features for quick access (max 2 as buttons)
  const recentFeatures = ui?.recentFeatures || [];
  const quickFeatures = mockFeatures
    .filter((f) => recentFeatures.includes(f.id) || recentFeatures.length === 0)
    .slice(0, 2);

  // Detect selected text
  useEffect(() => {
    if (visible) {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";
      setSelectedText(text);
    }
  }, [visible]);

  // Execute a feature with the selected text
  const handleFeatureExecute = async (featureId: string) => {
    if (!selectedText) {
      notification.warning({
        message: "Please select some text first",
        description: "Select text on the page to use AI features",
      });
      return;
    }

    const feature = mockFeatures.find((f) => f.id === featureId);
    if (!feature) return;

    setIsProcessing(true);
    addRecentFeature(featureId);

    try {
      // Detect content mode (simplified for now)
      detectContentMode();

      // Simulate AI processing (replace with actual service call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResult = `${feature.name} result for: "${selectedText.substring(
        0,
        50
      )}..."`;

      // Show result
      showResult(feature.name, mockResult);
    } catch (error) {
      console.error("Feature execution error:", error);
      notification.error({
        message: "Feature execution failed",
        description: "Please try again or check your AI service configuration",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const detectContentMode = (): ContentMode => {
    const domain = window.location.hostname.toLowerCase();

    if (
      domain.includes("fanfiction") ||
      domain.includes("archiveofourown") ||
      domain.includes("royalroad") ||
      domain.includes("webnovel")
    ) {
      return "novel";
    }

    if (
      domain.includes("news") ||
      domain.includes("cnn") ||
      domain.includes("bbc")
    ) {
      return "news";
    }

    if (domain.includes("github") || domain.includes("stackoverflow")) {
      return "code";
    }

    return "general";
  };

  const showResult = (featureName: string, result: string) => {
    // Create a simple result window (replace with proper modal later)
    const resultWindow = window.open("", "_blank", "width=600,height=400");
    if (resultWindow) {
      resultWindow.document.write(`
        <html>
          <head>
            <title>${featureName} Result</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h2 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
              .result { background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h2>${featureName} Result</h2>
            <div class="result">${result}</div>
          </body>
        </html>
      `);
    }
  };

  const getFeatureIcon = (category: string): string => {
    switch (category) {
      case "enhance":
        return "✨";
      case "analyze":
        return "🔍";
      case "transform":
        return "🔄";
      case "utility":
        return "🛠️";
      default:
        return "⚡";
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`novelsynth-floating-panel ${collapsed ? "collapsed" : ""}`}
    >
      {collapsed ? (
        <button
          className="floating-toggle-btn"
          onClick={() => setCollapsed(false)}
          title="Expand NovelSynth"
        >
          <ThunderboltOutlined />
        </button>
      ) : (
        <>
          <div className="floating-panel-header">
            <h3 className="floating-panel-title">NovelSynth</h3>
            <div className="floating-panel-actions">
              <Tooltip title="Minimize">
                <Button
                  type="text"
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => setCollapsed(true)}
                />
              </Tooltip>
              <Tooltip title="Settings">
                <Button
                  type="text"
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={() => {
                    notification.info({
                      message: "Settings coming soon",
                      description:
                        "Settings panel will be available in the next update",
                    });
                  }}
                />
              </Tooltip>
              <Tooltip title="Close">
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={onClose}
                />
              </Tooltip>
            </div>
          </div>

          <div className="floating-panel-content">
            {isProcessing && (
              <div className="floating-status processing">
                Processing with AI...
              </div>
            )}

            {selectedText ? (
              <div className="floating-status">
                Selected:{" "}
                {selectedText.length > 50
                  ? `${selectedText.substring(0, 50)}...`
                  : selectedText}
              </div>
            ) : (
              <div className="floating-status">
                Select text on the page to use AI features
              </div>
            )}

            <div className="floating-quick-actions">
              {quickFeatures.map((feature) => (
                <button
                  key={feature.id}
                  className="floating-action-btn"
                  onClick={() => handleFeatureExecute(feature.id)}
                  disabled={!selectedText || isProcessing}
                >
                  <div className="floating-action-icon">
                    {getFeatureIcon(feature.category)}
                  </div>
                  <div className="floating-action-text">
                    <div className="floating-action-name">{feature.name}</div>
                    <div className="floating-action-desc">
                      {feature.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {quickFeatures.length === 0 && (
              <div className="floating-status">
                No features configured. Open settings to add features.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
