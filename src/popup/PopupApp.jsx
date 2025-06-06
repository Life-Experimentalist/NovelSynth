import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Tabs,
  Button,
  Typography,
  Space,
  Divider,
  Badge,
  Tag,
  Statistic,
  Row,
  Col,
  Empty,
  Alert,
  Spin,
  Switch,
  Select,
  List,
} from "antd";
import {
  ReadOutlined,
  FileTextOutlined,
  BookOutlined,
  SettingOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./popup.css";
import StorageManager from "../utils/StorageManager";

const { Title, Text, Paragraph } = Typography;
const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

const PopupApp = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [settings, setSettings] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentDomain, setCurrentDomain] = useState("");
  const [pageInfo, setPageInfo] = useState(null);
  const [history, setHistory] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load settings, current tab info, and history
  const loadData = async () => {
    setLoading(true);

    try {
      // Get settings
      const settings = await StorageManager.getSettings();
      setSettings(settings);

      // Get current tab info
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs.length === 0) return;

        const tab = tabs[0];
        setCurrentUrl(tab.url);

        try {
          // Extract domain
          const url = new URL(tab.url);
          const domain = url.hostname.replace("www.", "");
          setCurrentDomain(domain);

          // Get history for this domain
          const domainHistory = await StorageManager.getDomainHistory(domain);
          setHistory(domainHistory);

          // Get cached analysis
          const cachedAnalysis = await StorageManager.getCachedAnalysis(
            tab.url
          );

          if (cachedAnalysis) {
            setPageInfo({
              title: tab.title,
              url: tab.url,
              domain: domain,
              wordCount: cachedAnalysis.wordCount || 0,
              contentType: cachedAnalysis.contentType || "unknown",
              analysis: cachedAnalysis,
            });
          } else {
            // Send message to content script to get page info
            chrome.tabs.sendMessage(
              tab.id,
              { action: "getPageInfo" },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error getting page info:",
                    chrome.runtime.lastError
                  );
                  setPageInfo({
                    title: tab.title,
                    url: tab.url,
                    domain: domain,
                    wordCount: 0,
                    contentType: "unknown",
                    isNovelSynthActive: false,
                  });
                  return;
                }

                if (response && response.success) {
                  setPageInfo({
                    title: tab.title,
                    url: tab.url,
                    domain: domain,
                    wordCount: response.wordCount || 0,
                    contentType: response.contentType || "unknown",
                    isNovelSynthActive: response.isNovelSynthActive || false,
                  });
                } else {
                  setPageInfo({
                    title: tab.title,
                    url: tab.url,
                    domain: domain,
                    wordCount: 0,
                    contentType: "unknown",
                    isNovelSynthActive: false,
                  });
                }
              }
            );
          }
        } catch (error) {
          console.error("Error processing tab info:", error);
          setPageInfo({
            title: tab.title,
            url: tab.url,
            domain: "unknown",
            wordCount: 0,
            contentType: "unknown",
            isNovelSynthActive: false,
          });
        }
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async (newSettings) => {
    setLoading(true);

    try {
      await StorageManager.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle action button clicks
  const handleAction = (action) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "performAction", actionType: action },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error performing action:", chrome.runtime.lastError);
            return;
          }

          // Close popup after sending action
          window.close();
        }
      );
    });
  };

  // Handle setting changes
  const handleSettingChange = (key, value) => {
    if (!settings) return;

    const newSettings = { ...settings };

    // Handle nested settings
    if (key.includes(".")) {
      const [parent, child] = key.split(".");
      newSettings[parent] = { ...newSettings[parent], [child]: value };
    } else {
      newSettings[key] = value;
    }

    saveSettings(newSettings);
  };

  // Clear history for current domain
  const clearDomainHistory = async () => {
    if (!currentDomain) return;

    setLoading(true);

    try {
      await StorageManager.clearDomainHistory(currentDomain);
      setHistory([]);
    } catch (error) {
      console.error("Error clearing domain history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Layout className="popup-layout">
        <Header className="popup-header">
          <div className="logo">
            <ReadOutlined />
          </div>
          <Title level={4}>NovelSynth</Title>
        </Header>
        <Content className="popup-content">
          <div className="loading-container">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="popup-layout">
      <Header className="popup-header">
        <div className="logo">
          <ReadOutlined />
        </div>
        <Title level={4}>NovelSynth</Title>
      </Header>
      <Content className="popup-content">
        {/* Site Info Card */}
        {pageInfo && (
          <Card className="site-info-card">
            <Row gutter={[8, 8]} align="middle">
              <Col span={16}>
                <Text strong ellipsis style={{ width: "100%" }}>
                  {pageInfo.domain}
                </Text>
                <Tag
                  color={
                    pageInfo.contentType === "novels"
                      ? "blue"
                      : pageInfo.contentType === "news"
                      ? "green"
                      : pageInfo.contentType === "learning"
                      ? "purple"
                      : "default"
                  }
                >
                  {pageInfo.contentType}
                </Tag>
              </Col>
              <Col span={8}>
                <Statistic
                  title="Words"
                  value={pageInfo.wordCount}
                  formatter={(value) =>
                    value > 0 ? value.toLocaleString() : "N/A"
                  }
                />
              </Col>
            </Row>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="popup-tabs"
        >
          {/* Home Tab */}
          <TabPane
            tab={
              <span>
                <ReadOutlined />
                Home
              </span>
            }
            key="home"
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {pageInfo && pageInfo.wordCount > 0 ? (
                <div className="action-buttons">
                  <Button
                    type="primary"
                    block
                    icon={<FileTextOutlined />}
                    onClick={() => handleAction("enhance")}
                  >
                    Enhance Content
                  </Button>

                  <Button
                    block
                    icon={<BookOutlined />}
                    onClick={() => handleAction("summarize")}
                  >
                    Summarize
                  </Button>

                  <Button
                    block
                    icon={<InfoCircleOutlined />}
                    onClick={() => handleAction("analyze")}
                  >
                    Analyze Content
                  </Button>
                </div>
              ) : (
                <Alert
                  message="No Content Detected"
                  description="NovelSynth couldn't detect enough content on this page. Try a page with more text content."
                  type="info"
                  showIcon
                />
              )}

              <Divider />

              <Text type="secondary">
                NovelSynth helps you enhance, summarize, and analyze web content
                with AI.
              </Text>
            </Space>
          </TabPane>

          {/* History Tab */}
          <TabPane
            tab={
              <span>
                <HistoryOutlined />
                History
              </span>
            }
            key="history"
          >
            {history.length > 0 ? (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong>Recent activity for {currentDomain}</Text>
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={clearDomainHistory}
                  />
                </div>

                <List
                  dataSource={history}
                  renderItem={(item) => (
                    <Card
                      className="history-card"
                      size="small"
                      style={{ marginBottom: 8 }}
                    >
                      <Space>
                        <span className="history-icon">
                          {item.type === "enhance" ? (
                            <FileTextOutlined />
                          ) : item.type === "summarize" ? (
                            <BookOutlined />
                          ) : (
                            <InfoCircleOutlined />
                          )}
                        </span>
                        <div className="history-content">
                          <Text strong>
                            {item.type.charAt(0).toUpperCase() +
                              item.type.slice(1)}
                          </Text>
                          <Text type="secondary">
                            {new Date(item.timestamp).toLocaleString()}
                          </Text>
                        </div>
                      </Space>
                    </Card>
                  )}
                />
              </Space>
            ) : (
              <Empty
                description="No history for this domain"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </TabPane>

          {/* Settings Tab */}
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Settings
              </span>
            }
            key="settings"
          >
            {settings && (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                {/* Appearance */}
                <div className="settings-group">
                  <Title level={5}>Appearance</Title>
                  <div className="settings-control">
                    <Text>Dark Mode</Text>
                    <Switch
                      checked={settings.theme === "dark"}
                      onChange={(checked) =>
                        handleSettingChange("theme", checked ? "dark" : "light")
                      }
                    />
                  </div>
                </div>

                {/* Content Settings */}
                <div className="settings-group">
                  <Title level={5}>Content</Title>
                  <div className="settings-control">
                    <Text>Show Processing Banner</Text>
                    <Switch
                      checked={settings.showProcessingBanner}
                      onChange={(checked) =>
                        handleSettingChange("showProcessingBanner", checked)
                      }
                    />
                  </div>
                  <div className="settings-control">
                    <Text>Content Detection</Text>
                    <Select
                      value={settings.contentMode}
                      style={{ width: 120 }}
                      onChange={(value) =>
                        handleSettingChange("contentMode", value)
                      }
                    >
                      <Option value="auto">Automatic</Option>
                      <Option value="novels">Novel Focus</Option>
                      <Option value="news">News Focus</Option>
                      <Option value="learning">Learning Focus</Option>
                    </Select>
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  block
                  onClick={async () => {
                    const defaultSettings =
                      await StorageManager.resetSettings();
                    setSettings(defaultSettings);
                  }}
                >
                  Reset to Defaults
                </Button>
              </Space>
            )}
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default PopupApp;
