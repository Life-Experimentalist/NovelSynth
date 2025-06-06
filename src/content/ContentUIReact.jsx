import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Card,
  Space,
  Button,
  Typography,
  Badge,
  Dropdown,
  Statistic,
  Progress,
  Divider,
  Row,
  Col,
  Alert,
  Tag,
} from "antd";
import {
  AimOutlined,
  SearchOutlined,
  FileTextOutlined,
  TranslationOutlined,
  MoreOutlined,
  SaveOutlined,
  SettingOutlined,
  CloseOutlined,
  RightOutlined,
  InfoCircleOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "./contentUI.css";

const { Title, Text } = Typography;

// Content UI Component
const ContentUI = ({ websiteInfo, contentInfo, onAction, onClose }) => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingType, setProcessingType] = useState("");

  // Handle action button clicks
  const handleAction = async (action) => {
    setLoading(true);
    setProcessingType(action);
    setShowResults(true);

    try {
      // Call the callback function that communicates with the content script
      const result = await onAction(action);
      setResults(result);
    } catch (error) {
      console.error("Action failed:", error);
      setResults({ error: error.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  // Handle result close button
  const handleCloseResults = () => {
    setShowResults(false);
    setResults(null);
  };

  // Render loading state
  const renderLoading = () => (
    <Card
      title={`${
        processingType.charAt(0).toUpperCase() + processingType.slice(1)
      } in Progress`}
      className="novelsynth-results-card"
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleCloseResults}
        />
      }
    >
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div className="loading-spinner"></div>
        <Text style={{ display: "block", marginTop: 16 }}>
          Processing your content with AI...
        </Text>
      </div>
    </Card>
  );

  // Render results card based on action type
  const renderResults = () => {
    if (!results) return null;

    if (results.error) {
      return (
        <Card
          title="Error Occurred"
          className="novelsynth-results-card"
          extra={
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCloseResults}
            />
          }
        >
          <Alert
            message="Processing Error"
            description={results.error}
            type="error"
            showIcon
          />
        </Card>
      );
    }

    let content = null;
    let title = "";

    switch (processingType) {
      case "enhance":
        title = "Enhancement Results";
        content = (
          <div>
            <div className="novelsynth-result-stats">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Readability Score"
                    value={results.readabilityScore || "82"}
                    suffix="/100"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Improvements"
                    value={results.improvements || "12"}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Text type="secondary">Quality Assessment</Text>
                  <Progress
                    percent={results.qualityScore || 75}
                    status="active"
                  />
                </Col>
              </Row>
            </div>
            <Divider />
            <Text>
              {results.enhancedText || "No enhancement text available."}
            </Text>
          </div>
        );
        break;

      case "analyze":
        title = "Analysis Results";
        content = (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Word Count"
                  value={results.wordCount || contentInfo.wordCount}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Reading Time"
                  value={
                    results.readingTime ||
                    Math.round(contentInfo.wordCount / 200)
                  }
                  suffix="min"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Complexity"
                  value={results.complexity || "Medium"}
                />
              </Col>
            </Row>
            <Divider />
            <div>
              <Title level={5}>Content Overview</Title>
              <Text>{results.analysis || "No analysis available."}</Text>
            </div>
          </div>
        );
        break;

      case "summarize":
        title = "Summary Results";
        content = (
          <div>
            <Alert
              message="Content Summary"
              description={results.summary || "No summary available."}
              type="info"
              showIcon
            />
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Original Length"
                  value={contentInfo.wordCount}
                  suffix="words"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Summary Length"
                  value={
                    results.summaryWordCount ||
                    Math.round(contentInfo.wordCount * 0.2)
                  }
                  suffix="words"
                />
              </Col>
            </Row>
          </div>
        );
        break;

      case "translate":
        title = "Translation Results";
        content = (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Badge
                status="processing"
                text={`Translated to ${results.targetLanguage || "English"}`}
              />
            </div>
            <div className="translated-text">
              {results.translatedText || "No translation available."}
            </div>
          </div>
        );
        break;

      default:
        title = "Results";
        content = <Text>No results available</Text>;
    }

    return (
      <Card
        title={title}
        className="novelsynth-results-card"
        extra={
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleCloseResults}
          />
        }
      >
        {content}
      </Card>
    );
  };

  // Main component render
  return (
    <div className="novelsynth-ui">
      {/* Actions Panel */}
      <Card
        className="novelsynth-actions-panel"
        title={
          <div className="novelsynth-panel-header">
            <div className="novelsynth-site-info">
              <Badge status="processing" text="NovelSynth" />
              <Tag
                color={
                  websiteInfo.category === "novels"
                    ? "blue"
                    : websiteInfo.category === "news"
                    ? "green"
                    : websiteInfo.category === "learning"
                    ? "purple"
                    : "orange"
                }
              >
                {websiteInfo.site}
              </Tag>
            </div>
            <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
          </div>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Statistic
                title="Word Count"
                value={contentInfo.wordCount}
                formatter={(value) => value.toLocaleString()}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Reading Time"
                value={Math.round(contentInfo.wordCount / 200)}
                suffix="min"
              />
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0" }} />

          <Space direction="vertical" style={{ width: "100%" }} size="small">
            <Button
              type="primary"
              block
              className="enhance-btn"
              icon={<AimOutlined />}
              onClick={() => handleAction("enhance")}
            >
              Enhance Content
            </Button>

            <Row gutter={8}>
              <Col span={12}>
                <Button
                  block
                  className="analyze-btn"
                  icon={<SearchOutlined />}
                  onClick={() => handleAction("analyze")}
                >
                  Analyze
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  className="summarize-btn"
                  icon={<FileTextOutlined />}
                  onClick={() => handleAction("summarize")}
                >
                  Summarize
                </Button>
              </Col>
            </Row>

            <Button
              block
              icon={<TranslationOutlined />}
              onClick={() => handleAction("translate")}
            >
              Translate
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Results Card */}
      {showResults && (loading ? renderLoading() : renderResults())}
    </div>
  );
};

// Export function to inject the UI into the page
export const injectContentUI = (websiteInfo, contentInfo) => {
  // Create container element
  const container = document.createElement("div");
  container.id = "novelsynth-container";
  document.body.appendChild(container);

  // Create React root
  const root = createRoot(container);

  // Render React component
  root.render(
    <ContentUI
      websiteInfo={websiteInfo}
      contentInfo={contentInfo}
      onAction={(action) => {
        return new Promise((resolve, reject) => {
          // Send message to content script
          chrome.runtime.sendMessage(
            {
              action: "processContent",
              contentAction: action,
            },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
              }

              if (!response || response.error) {
                reject(new Error(response?.error || "Unknown error"));
                return;
              }

              resolve(response.result);
            }
          );
        });
      }}
      onClose={() => {
        // Remove the UI container
        root.unmount();
        container.remove();
      }}
    />
  );

  return container;
};

export default ContentUI;
