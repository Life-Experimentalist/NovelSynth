// NovelSynth Content Script
class NovelSynthContent {
  constructor() {
    this.isProcessing = false;
    this.banner = null;
    this.init();
  }

  init() {
    console.log("NovelSynth content script loaded");
    this.setupMessageListener();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("Content script received message:", request);
      try {
        switch (request.action) {
          case "ping":
            sendResponse({ status: "pong", timestamp: Date.now() });
            return false; // Synchronous response

          case "getPageInfo":
            this.handleGetPageInfo(sendResponse);
            return false; // Synchronous response

          case "enhance":
            this.handleEnhance(request.settings, sendResponse);
            return true; // Will respond asynchronously

          case "analyze":
            this.handleAnalyze(request.settings, sendResponse);
            return true; // Will respond asynchronously

          case "summarize":
            this.handleSummarize(request.settings, sendResponse);
            return true; // Will respond asynchronously

          case "suggestions":
            this.handleSuggestions(request.settings, sendResponse);
            return true; // Will respond asynchronously

          default:
            sendResponse({ success: false, error: "Unknown action" });
            return false;
        }
      } catch (error) {
        console.error("Error handling message:", error);
        sendResponse({ success: false, error: error.message });
        return false;
      }
    });
  }

  async handleGetPageInfo(sendResponse) {
    try {
      const pageInfo = {
        status: "Ready",
        contentType: this.detectContentType(),
        wordCount: this.getWordCount(),
        url: window.location.href,
        title: document.title,
      };

      sendResponse(pageInfo);
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleEnhance(settings, sendResponse) {
    try {
      this.showProcessingBanner("Enhancing content...");

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get selected text or page content
      const content = this.getSelectedTextOrContent();

      if (!content) {
        throw new Error("No content found to enhance");
      }

      // Here you would make the actual API call
      // For now, we'll simulate success
      const result = await this.makeApiCall("enhance", content, settings);

      this.hideBanner();
      sendResponse({ success: true, result: result });
    } catch (error) {
      this.hideBanner();
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleAnalyze(settings, sendResponse) {
    try {
      this.showProcessingBanner("Analyzing content...");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const content = this.getSelectedTextOrContent();

      if (!content) {
        throw new Error("No content found to analyze");
      }

      const result = await this.makeApiCall("analyze", content, settings);

      this.hideBanner();
      sendResponse({ success: true, result: result });
    } catch (error) {
      this.hideBanner();
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleSummarize(settings, sendResponse) {
    try {
      this.showProcessingBanner("Summarizing content...");

      await new Promise((resolve) => setTimeout(resolve, 1800));

      const content = this.getSelectedTextOrContent();

      if (!content) {
        throw new Error("No content found to summarize");
      }

      const result = await this.makeApiCall("summarize", content, settings);

      this.hideBanner();
      sendResponse({ success: true, result: result });
    } catch (error) {
      this.hideBanner();
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleSuggestions(settings, sendResponse) {
    try {
      this.showProcessingBanner("Generating suggestions...");

      await new Promise((resolve) => setTimeout(resolve, 2200));

      const content = this.getSelectedTextOrContent();

      if (!content) {
        throw new Error("No content found for suggestions");
      }

      const result = await this.makeApiCall("suggestions", content, settings);

      this.hideBanner();
      sendResponse({ success: true, result: result });
    } catch (error) {
      this.hideBanner();
      sendResponse({ success: false, error: error.message });
    }
  }

  async makeApiCall(action, content, settings) {
    // Mock API call - replace with actual API integration
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      action: action,
      originalContent: content.substring(0, 100) + "...",
      processedContent: `${
        action.charAt(0).toUpperCase() + action.slice(1)
      }d version of the content`,
      provider: settings.provider || "gemini",
      model: settings.model || "gemini-1.5-flash",
      timestamp: new Date().toISOString(),
    };
  }

  getSelectedTextOrContent() {
    // Get selected text first
    const selection = window.getSelection().toString().trim();
    if (selection) {
      return selection;
    }

    // Fall back to main content
    const contentSelectors = [
      "article",
      '[role="main"]',
      ".content",
      ".post-content",
      ".entry-content",
      ".main-content",
      "main",
      "#content",
      ".story-text",
      ".chapter-content",
    ];

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.innerText.trim();
      }
    }

    // Last resort - get text from body
    const bodyText = document.body.innerText.trim();
    return bodyText.substring(0, 5000); // Limit to first 5000 characters
  }

  detectContentType() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();

    if (
      url.includes("novel") ||
      url.includes("story") ||
      url.includes("chapter")
    ) {
      return "Novel/Story";
    }
    if (url.includes("blog") || url.includes("article")) {
      return "Article/Blog";
    }
    if (title.includes("chapter") || title.includes("story")) {
      return "Story Content";
    }
    if (document.querySelector("article")) {
      return "Article";
    }

    return "Web Page";
  }

  getWordCount() {
    const content = this.getSelectedTextOrContent();
    if (!content) return 0;

    return content.split(/\s+/).filter((word) => word.length > 0).length;
  }

  showProcessingBanner(message) {
    this.hideBanner(); // Remove any existing banner

    this.banner = document.createElement("div");
    this.banner.id = "novelsynth-banner";
    this.banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      text-align: center;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      backdrop-filter: blur(10px);
    `;

    this.banner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
        <div style="width: 16px; height: 16px; border: 2px solid #ffffff40; border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <span>${message}</span>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    document.body.appendChild(this.banner);

    // Adjust page content to avoid overlap
    document.body.style.paddingTop = "50px";
  }

  hideBanner() {
    if (this.banner) {
      this.banner.remove();
      this.banner = null;
      document.body.style.paddingTop = "";
    }
  }
}

// Initialize content script
if (!window.novelSynthContent) {
  window.novelSynthContent = new NovelSynthContent();
}
