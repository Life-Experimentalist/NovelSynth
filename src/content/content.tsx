// Content script for NovelSynth - injected into web pages
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { ExtensionProvider } from "../contexts/ExtensionContext";
import { FloatingPanel } from "../components/features/FloatingPanel";

// Initialize feature registry  featureRegistry.initialize();

// Content script state
let isInitialized = false;
let floatingPanelRoot: any = null;
let queryClient: QueryClient;

// Initialize content script
function initializeContentScript() {
  if (isInitialized) return;

  console.log("NovelSynth: Initializing content script");

  // Create React Query client
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  });

  // Create floating panel container
  createFloatingPanel();

  // Listen for messages from popup/background
  setupMessageListeners();

  // Detect content changes for better website handling
  setupContentObserver();

  isInitialized = true;
  console.log("NovelSynth: Content script initialized");
}

// Create and mount floating panel
function createFloatingPanel() {
  // Check if container already exists
  let container = document.getElementById("novelsynth-floating-panel");

  if (!container) {
    container = document.createElement("div");
    container.id = "novelsynth-floating-panel";
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2147483647;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  // Create React root
  floatingPanelRoot = createRoot(container);

  // Render floating panel (initially hidden)
  renderFloatingPanel(false);
}

// Render floating panel component
function renderFloatingPanel(visible: boolean) {
  if (!floatingPanelRoot) return;

  const antdTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: "#1890ff",
      borderRadius: 6,
      fontSize: 14,
    },
  };

  floatingPanelRoot.render(
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <ExtensionProvider>
          <div style={{ pointerEvents: visible ? "auto" : "none" }}>
            <FloatingPanel
              visible={visible}
              onClose={() => renderFloatingPanel(false)}
            />
          </div>
        </ExtensionProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

// Setup message listeners for communication with popup/background
function setupMessageListeners() {
  // Listen for messages from popup or background script
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    switch (message.type) {
      case "TOGGLE_FLOATING_PANEL":
        renderFloatingPanel(message.visible);
        sendResponse({ success: true });
        break;

      case "GET_SELECTED_TEXT":
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || "";
        sendResponse({ selectedText });
        break;

      case "GET_PAGE_CONTENT":
        const pageContent = extractPageContent();
        sendResponse({ content: pageContent });
        break;

      case "INJECT_RESULT":
        injectResultIntoPage(message.result, message.position);
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ error: "Unknown message type" });
    }
  });
}

// Setup content observer to detect page changes
function setupContentObserver() {
  // Watch for content changes that might indicate new chapters/articles
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Check if significant content was added
        const hasTextContent = Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node as Element).textContent &&
            (node as Element).textContent!.length > 100
        );

        if (hasTextContent) {
          // Notify background script of content change
          chrome.runtime.sendMessage({
            type: "CONTENT_CHANGED",
            url: window.location.href,
            domain: window.location.hostname,
          });
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Extract page content for processing
function extractPageContent(): any {
  const url = window.location.href;
  const domain = window.location.hostname;

  // Try to find the main content area
  const contentSelectors = [
    "article",
    "main",
    ".content",
    "#content",
    ".post-content",
    ".entry-content",
    ".story-text",
    ".chapter-content",
    '[role="main"]',
  ];

  let mainContent = "";
  let title = document.title;

  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent && element.textContent.length > 100) {
      mainContent = element.textContent.trim();
      break;
    }
  }

  // Fallback to body content if no main content found
  if (!mainContent) {
    mainContent = document.body.textContent?.trim() || "";
  }

  // Try to extract title from content if generic
  if (title === "Untitled" || title.length < 3) {
    const h1 = document.querySelector("h1");
    if (h1?.textContent) {
      title = h1.textContent.trim();
    }
  }

  return {
    url,
    domain,
    title,
    content: mainContent.substring(0, 10000), // Limit content size
    wordCount: mainContent.split(/\s+/).length,
    timestamp: Date.now(),
  };
}

// Inject AI result into the page
function injectResultIntoPage(
  result: string,
  position: "top" | "bottom" | "popup" = "popup"
) {
  if (position === "popup") {
    // Show result in a modal-like overlay
    showResultPopup(result);
  } else {
    // Inject result at top or bottom of main content
    const mainContent = document.querySelector(
      "article, main, .content, #content"
    );
    if (mainContent) {
      const resultDiv = document.createElement("div");
      resultDiv.className = "novelsynth-result";
      resultDiv.style.cssText = `
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      `;
      resultDiv.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <strong style="color: #1890ff;">NovelSynth AI</strong>
          <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; cursor: pointer; font-size: 18px;">&times;</button>
        </div>
        <div style="white-space: pre-wrap;">${result}</div>
      `;

      if (position === "top") {
        mainContent.insertBefore(resultDiv, mainContent.firstChild);
      } else {
        mainContent.appendChild(resultDiv);
      }

      // Scroll to result
      resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

// Show result in a popup overlay
function showResultPopup(result: string) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2147483646;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
  `;

  // Create popup
  const popup = document.createElement("div");
  popup.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
  `;

  popup.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 16px;">
      <strong style="color: #1890ff; font-size: 18px;">NovelSynth AI Result</strong>
      <button id="novelsynth-close-popup" style="margin-left: auto; background: #f5f5f5; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer;">Close</button>
    </div>
    <div style="white-space: pre-wrap; color: #333;">${result}</div>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Close popup handlers
  document
    .getElementById("novelsynth-close-popup")
    ?.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });

  // Close on escape key
  const closeOnEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      document.removeEventListener("keydown", closeOnEscape);
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }
  };
  document.addEventListener("keydown", closeOnEscape);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeContentScript);
} else {
  initializeContentScript();
}

// Re-initialize if navigating via AJAX (for SPAs)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Small delay to let page settle
    setTimeout(initializeContentScript, 1000);
  }
}).observe(document, { subtree: true, childList: true });
