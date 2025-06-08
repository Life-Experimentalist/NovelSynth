import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Space, Tag, Tooltip, message } from "antd";
import {
  CopyOutlined,
  LinkOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface WebpageDetailsProps {
  className?: string;
  style?: React.CSSProperties;
}

interface PageInfo {
  title: string;
  url: string;
  author?: string;
  description?: string;
  wordCount?: number;
  chapterNumber?: number;
  storyTitle?: string;
}

export const WebpageDetails: React.FC<WebpageDetailsProps> = ({
  className,
  style,
}) => {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    extractPageInfo();
  }, []);

  const extractPageInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current tab information
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.url) {
        setError("Unable to access current tab");
        return;
      }

      // Extract basic page information
      const info: PageInfo = {
        title: tab.title || "Unknown Page",
        url: tab.url,
      };

      // Try to extract more details by injecting a content script
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: () => {
            // Extract FanFiction.net specific information
            if (window.location.hostname.includes("fanfiction.net")) {
              const storyTitle = document
                .querySelector("#profile_top b.xcontrast_txt")
                ?.textContent?.trim();
              const author = document
                .querySelector('#profile_top a[href*="/u/"]')
                ?.textContent?.trim();
              const description = document
                .querySelector("#summary")
                ?.textContent?.trim();
              const storytext = document.getElementById("storytext");
              const wordCount = storytext
                ? storytext.textContent?.split(/\s+/).length
                : 0;

              // Extract chapter number
              let chapterNumber: number | undefined;
              const urlMatch = window.location.href.match(/\/s\/\d+\/(\d+)\//);
              if (urlMatch) {
                chapterNumber = parseInt(urlMatch[1]);
              }

              return {
                storyTitle,
                author,
                description,
                wordCount: wordCount || undefined,
                chapterNumber,
              };
            }

            // Generic extraction for other sites
            const wordCount =
              document.body.textContent?.split(/\s+/).length || 0;
            return {
              wordCount: wordCount > 100 ? wordCount : undefined,
            };
          },
        });

        if (result?.result) {
          Object.assign(info, result.result);
        }
      } catch (scriptError) {
        console.warn("Could not extract detailed page info:", scriptError);
      }

      setPageInfo(info);
    } catch (err) {
      console.error("Error extracting page info:", err);
      setError("Error extracting page information");
    } finally {
      setLoading(false);
    }
  };

  const copyContent = async () => {
    try {
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
          // Try to get main content area
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

          // Fallback to body content
          return document.body.textContent?.trim() || "";
        },
      });

      if (result?.result) {
        await navigator.clipboard.writeText(result.result);
        message.success("Content copied to clipboard");
      } else {
        message.error("No content found to copy");
      }
    } catch (err) {
      console.error("Failed to copy content:", err);
      message.error("Failed to copy content");
    }
  };

  const openInNewTab = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab?.url) {
        await chrome.tabs.create({ url: tab.url });
      }
    } catch (err) {
      console.error("Failed to open in new tab:", err);
      message.error("Failed to open in new tab");
    }
  };

  const formatWordCount = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  const getReadingTime = (wordCount: number): number => {
    return Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
  };

  if (loading) {
    return (
      <Card className={className} style={style} size="small" loading={true}>
        <div style={{ height: 80 }}>Loading page details...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className} style={style} size="small">
        <div style={{ textAlign: "center", color: "#ff4d4f" }}>
          <Text type="secondary">{error}</Text>
          <br />
          <Button type="link" size="small" onClick={extractPageInfo}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!pageInfo) {
    return (
      <Card className={className} style={style} size="small">
        <div style={{ textAlign: "center" }}>
          <Text type="secondary">No page details available</Text>
        </div>
      </Card>
    );
  }

  const isFanfiction = pageInfo.url.includes("fanfiction.net");

  return (
    <Card
      className={className}
      style={style}
      size="small"
      title={
        <Space>
          <FileTextOutlined />
          <Text strong>Page Details</Text>
          {isFanfiction && <Tag color="purple">Fanfiction</Tag>}
        </Space>
      }
      extra={
        <Space>
          <Tooltip title="Copy content">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={copyContent}
            />
          </Tooltip>{" "}
          <Tooltip title="Open in new tab">
            <Button
              type="text"
              size="small"
              icon={<LinkOutlined />}
              onClick={openInNewTab}
            />
          </Tooltip>
        </Space>
      }
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        {/* Title */}
        <div>
          <Text strong style={{ fontSize: "14px" }}>
            {pageInfo.title}
          </Text>
        </div>
        {/* Story/Chapter specific info for FanFiction.net */}
        {isFanfiction && (
          <Space wrap size="small">
            {pageInfo.storyTitle && pageInfo.storyTitle !== pageInfo.title && (
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Story: {pageInfo.storyTitle}
              </Text>
            )}{" "}
            {pageInfo.chapterNumber && (
              <Tag icon={<FileTextOutlined />}>
                Chapter {pageInfo.chapterNumber}
              </Tag>
            )}
            {pageInfo.author && (
              <Tag icon={<UserOutlined />}>{pageInfo.author}</Tag>
            )}
          </Space>
        )}
        {/* Content statistics */}{" "}
        {pageInfo.wordCount && (
          <Space wrap size="small">
            <Tag icon={<FileTextOutlined />}>
              {formatWordCount(pageInfo.wordCount)} words
            </Tag>
            <Tag icon={<ClockCircleOutlined />}>
              {getReadingTime(pageInfo.wordCount)} min read
            </Tag>
          </Space>
        )}
        {/* Description */}
        {pageInfo.description && (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
            style={{ fontSize: "12px", margin: "4px 0 0 0" }}
            type="secondary"
          >
            {pageInfo.description}
          </Paragraph>
        )}
        {/* URL */}
        <Text
          type="secondary"
          style={{ fontSize: "11px", wordBreak: "break-all" }}
          ellipsis={{ tooltip: pageInfo.url }}
        >
          {pageInfo.url}
        </Text>
      </Space>
    </Card>
  );
};
