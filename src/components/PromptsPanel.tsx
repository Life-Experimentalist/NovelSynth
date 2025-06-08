import React, { useState } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  List,
  Input,
  message,
  Tag,
  Tooltip,
} from "antd";
import {
  MessageOutlined,
  CopyOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  isCustom: boolean;
}

const defaultPrompts: Prompt[] = [
  {
    id: "summarize",
    title: "Summarize Text",
    content:
      "Please provide a concise summary of the following text, highlighting the key points and main themes:\n\n{content}",
    category: "Analysis",
    isFavorite: true,
    isCustom: false,
  },
  {
    id: "analyze-style",
    title: "Analyze Writing Style",
    content:
      "Analyze the writing style of the following text, including tone, narrative voice, literary devices, and overall approach:\n\n{content}",
    category: "Analysis",
    isFavorite: false,
    isCustom: false,
  },
  {
    id: "extract-themes",
    title: "Extract Themes",
    content:
      "Identify and explain the main themes present in this text:\n\n{content}",
    category: "Analysis",
    isFavorite: false,
    isCustom: false,
  },
  {
    id: "character-analysis",
    title: "Character Analysis",
    content:
      "Analyze the characters in this text, including their development, relationships, and significance to the story:\n\n{content}",
    category: "Characters",
    isFavorite: false,
    isCustom: false,
  },
];

export const PromptsPanel: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>(defaultPrompts);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isCreating, setIsCreating] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    content: "",
    category: "Custom",
  });

  const categories = ["All", ...new Set(prompts.map((p) => p.category))];

  const filteredPrompts =
    selectedCategory === "All"
      ? prompts
      : prompts.filter((p) => p.category === selectedCategory);

  const favoritePrompts = prompts.filter((p) => p.isFavorite);

  const copyPrompt = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.content);
    message.success(`"${prompt.title}" copied to clipboard`);
  };

  const toggleFavorite = (promptId: string) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const deletePrompt = (promptId: string) => {
    const prompt = prompts.find((p) => p.id === promptId);
    if (prompt && !prompt.isCustom) {
      message.warning("Cannot delete default prompts");
      return;
    }

    setPrompts((prev) => prev.filter((p) => p.id !== promptId));
    message.success("Prompt deleted");
  };

  const createPrompt = () => {
    if (!newPrompt.title.trim() || !newPrompt.content.trim()) {
      message.error("Please fill in both title and content");
      return;
    }

    const prompt: Prompt = {
      id: `custom_${Date.now()}`,
      title: newPrompt.title.trim(),
      content: newPrompt.content.trim(),
      category: newPrompt.category,
      isFavorite: false,
      isCustom: true,
    };

    setPrompts((prev) => [...prev, prompt]);
    setNewPrompt({ title: "", content: "", category: "Custom" });
    setIsCreating(false);
    message.success("Prompt created successfully");
  };

  const sendToAI = async (prompt: Prompt) => {
    try {
      // Get current page content
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) {
        message.error("Cannot access current tab");
        return;
      }

      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const contentSelectors = [
            "#storytext", // FanFiction.net
            ".chapter-content",
            ".post-content",
            "article",
            "main",
            ".content",
          ];

          for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (
              element &&
              element.textContent &&
              element.textContent.length > 100
            ) {
              return element.textContent.trim();
            }
          }
          return document.body.textContent?.trim() || "";
        },
      });

      if (!result?.result) {
        message.error("No content found on current page");
        return;
      }

      const finalPrompt = prompt.content.replace("{content}", result.result);

      // Copy to clipboard and notify user
      await navigator.clipboard.writeText(finalPrompt);
      message.success(
        "Prompt with content copied to clipboard! Paste it into your AI service."
      );
    } catch (error) {
      console.error("Error preparing prompt:", error);
      message.error("Failed to prepare prompt");
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      {/* Favorites */}
      {favoritePrompts.length > 0 && (
        <Card
          size="small"
          title={
            <Space>
              <StarFilled style={{ color: "#faad14" }} />
              <Text strong>Favorites</Text>
            </Space>
          }
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {favoritePrompts.map((prompt) => (
              <Button
                key={prompt.id}
                type="dashed"
                size="small"
                style={{
                  textAlign: "left",
                  height: "auto",
                  padding: "8px 12px",
                }}
                onClick={() => sendToAI(prompt)}
                block
              >
                <div>
                  <Text strong style={{ fontSize: "12px" }}>
                    {prompt.title}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "10px" }}>
                    Click to use with current page
                  </Text>
                </div>
              </Button>
            ))}
          </Space>
        </Card>
      )}

      {/* Category Filter */}
      <Card size="small" title="Browse Prompts">
        <Space wrap style={{ marginBottom: 12 }}>
          {categories.map((category) => (
            <Button
              key={category}
              size="small"
              type={selectedCategory === category ? "primary" : "default"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </Space>

        {/* Prompts List */}
        <List
          size="small"
          dataSource={filteredPrompts}
          renderItem={(prompt) => (
            <List.Item style={{ padding: "8px 0" }}>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 4,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {" "}
                    <Space>
                      <Text strong style={{ fontSize: "12px" }}>
                        {prompt.title}
                      </Text>
                      <Tag>{prompt.category}</Tag>
                      {prompt.isCustom && <Tag color="blue">Custom</Tag>}
                    </Space>
                  </div>
                  <Space size="small">
                    <Tooltip
                      title={
                        prompt.isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={
                          prompt.isFavorite ? (
                            <StarFilled style={{ color: "#faad14" }} />
                          ) : (
                            <StarOutlined />
                          )
                        }
                        onClick={() => toggleFavorite(prompt.id)}
                      />
                    </Tooltip>
                    <Tooltip title="Copy prompt">
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => copyPrompt(prompt)}
                      />
                    </Tooltip>
                    <Tooltip title="Use with current page">
                      <Button
                        type="text"
                        size="small"
                        icon={<MessageOutlined />}
                        onClick={() => sendToAI(prompt)}
                      />
                    </Tooltip>
                    {prompt.isCustom && (
                      <Tooltip title="Delete prompt">
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => deletePrompt(prompt.id)}
                        />
                      </Tooltip>
                    )}
                  </Space>
                </div>
                <Paragraph
                  ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                  style={{ fontSize: "11px", margin: 0, color: "#666" }}
                >
                  {prompt.content}
                </Paragraph>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* Create New Prompt */}
      <Card
        size="small"
        title="Create Custom Prompt"
        extra={
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? "Cancel" : "New"}
          </Button>
        }
      >
        {isCreating && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              placeholder="Prompt title"
              value={newPrompt.title}
              onChange={(e) =>
                setNewPrompt((prev) => ({ ...prev, title: e.target.value }))
              }
              size="small"
            />
            <TextArea
              placeholder="Prompt content... Use {content} as placeholder for page content"
              value={newPrompt.content}
              onChange={(e) =>
                setNewPrompt((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={4}
              size="small"
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Input
                placeholder="Category"
                value={newPrompt.category}
                onChange={(e) =>
                  setNewPrompt((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                size="small"
                style={{ width: 120 }}
              />
              <Button type="primary" size="small" onClick={createPrompt}>
                Create
              </Button>
            </div>
          </Space>
        )}

        {!isCreating && (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Create custom prompts for your specific analysis needs
          </Text>
        )}
      </Card>
    </Space>
  );
};
