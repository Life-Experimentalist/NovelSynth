import React, { useState, useEffect, useCallback } from "react";
import { Button, Dropdown, Space, Tooltip, message } from "antd";
import { DownOutlined, MoreOutlined } from "@ant-design/icons";
import { featureRegistry } from "../../features/registry";
import { Feature } from "../../types";

interface TopButtonPanelProps {
  recentFeatures: string[];
}

export const TopButtonPanel: React.FC<TopButtonPanelProps> = ({
  recentFeatures,
}) => {
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    setAllFeatures(featureRegistry.getAll());
  }, []);

  const executeFeature = useCallback(
    async (featureId: string, selectedText?: string) => {
      try {
        setIsExecuting(featureId);

        // Get content from page or selected text
        const content = selectedText || extractPageContent();
        if (!content) {
          message.error("No content found to process");
          return;
        }

        // Send message to content script
        await chrome.runtime.sendMessage({
          action: "executeFeature",
          data: {
            featureId,
            content,
            selectedText: !!selectedText,
          },
        });

        // Update recent features
        updateRecentFeatures(featureId);

        message.success("Feature executed successfully!");
      } catch (error) {
        console.error("Feature execution error:", error);
        message.error("Failed to execute feature");
      } finally {
        setIsExecuting(null);
      }
    },
    []
  );

  const extractPageContent = (): string => {
    // Get selected text first
    const selection = window.getSelection()?.toString();
    if (selection && selection.trim().length > 50) {
      return selection.trim();
    }

    // Fallback to content extraction
    const contentSelectors = [
      "#storytext", // FanFiction.Net
      ".userstuff", // Archive of Our Own
      ".chapter-content", // Royal Road
      "[data-testid='story-part-content']", // Wattpad
      "article",
      "main",
      ".post-content",
      ".entry-content",
      ".content",
    ];

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (
        element &&
        element.textContent &&
        element.textContent.trim().length > 100
      ) {
        return element.textContent.trim();
      }
    }

    return "";
  };

  const updateRecentFeatures = (featureId: string) => {
    // Send to background to update storage
    chrome.runtime.sendMessage({
      action: "updateRecentFeatures",
      data: { featureId },
    });
  };

  // Get top 2 recent features for buttons
  const topFeatures = recentFeatures
    .slice(0, 2)
    .map((id) => allFeatures.find((f) => f.id === id))
    .filter(Boolean) as Feature[];

  // Get remaining features for dropdown
  const remainingFeatures = allFeatures.filter(
    (f) => !recentFeatures.slice(0, 2).includes(f.id)
  );

  const dropdownItems = remainingFeatures.map((feature) => ({
    key: feature.id,
    label: (
      <Space>
        <span>{feature.icon}</span>
        <span>{feature.name}</span>
      </Space>
    ),
    onClick: () => executeFeature(feature.id),
  }));

  const handleDropdownClick = ({ key }: { key: string }) => {
    executeFeature(key);
  };

  if (topFeatures.length === 0 && remainingFeatures.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 16px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "16px",
      }}
    >
      <span
        style={{
          color: "white",
          fontWeight: "600",
          fontSize: "14px",
          marginRight: "8px",
        }}
      >
        ✨ NovelSynth:
      </span>

      {/* Top 2 Recent Feature Buttons */}
      {topFeatures.map((feature) => (
        <Tooltip key={feature.id} title={feature.description}>
          <Button
            type="primary"
            size="small"
            icon={<span>{feature.icon}</span>}
            loading={isExecuting === feature.id}
            onClick={() => executeFeature(feature.id)}
            style={{
              background: "rgba(255,255,255,0.2)",
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
              fontSize: "12px",
            }}
          >
            {feature.name}
          </Button>
        </Tooltip>
      ))}

      {/* Dropdown for remaining features */}
      {remainingFeatures.length > 0 && (
        <Dropdown
          menu={{
            items: dropdownItems,
            onClick: handleDropdownClick,
          }}
          placement="bottomLeft"
          trigger={["click"]}
        >
          <Button
            size="small"
            icon={<MoreOutlined />}
            style={{
              background: "rgba(255,255,255,0.2)",
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
              fontSize: "12px",
            }}
          >
            More <DownOutlined />
          </Button>
        </Dropdown>
      )}

      {/* Quick selection indicator */}
      <div
        style={{
          marginLeft: "auto",
          color: "rgba(255,255,255,0.8)",
          fontSize: "11px",
          fontStyle: "italic",
        }}
      >
        {window.getSelection()?.toString().trim()
          ? "Selection ready"
          : "Full content"}
      </div>
    </div>
  );
};
