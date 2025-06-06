/**
 * Content script for NovelSynth extension
 * Handles content enhancement, summarization, and analysis
 */
import FloatingUI from "./FloatingUI";

// Store content and session state
let currentContent = "";
let selectedText = "";
let processingContent = false;
let floatingUI = null;

/**
 * Initialize the content script
 */
function initialize() {
  console.log("NovelSynth content script initialized");

  // Create the floating UI
  floatingUI = new FloatingUI();
  floatingUI.init();

  // Listen for messages from popup or background script
  chrome.runtime.onMessage.addListener(handleMessage);

  // Handle messages from popup and background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Content script received message:", request.action);

    if (request.action === "getContentInfo") {
      // Get info about the current page content
      const contentInfo = {
        type: floatingUI.currentWebsiteType,
        url: window.location.href,
        title: document.title,
      };

      sendResponse(contentInfo);
    }

    if (request.action === "processContent") {
      // Process the content with the provided settings
      const { operation, settings, prompt } = request;

      if (operation === "enhance") {
        floatingUI.enhanceContent();
        sendResponse({ success: true });
      } else if (operation === "summarize") {
        floatingUI.summarizeContent();
        sendResponse({ success: true });
      } else if (operation === "analyze") {
        floatingUI.analyzeContent();
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: "Unknown operation" });
      }
    }

    return true; // Keep the message channel open for async response
  });

  // Listen for text selection changes
  document.addEventListener("mouseup", handleTextSelection);

  // Add keyboard shortcut listener
  document.addEventListener("keydown", handleKeyboardShortcut);
}

/**
 * Handle messages from popup or background
 */
function handleMessage(message, sender, sendResponse) {
  switch (message.action) {
    case "enhanceContent":
      enhanceContent(sendResponse);
      return true; // Keep the message channel open for async response

    case "summarizeContent":
      summarizeContent(sendResponse);
      return true;

    case "analyzeContent":
      analyzeContent(sendResponse);
      return true;

    case "getSelectedText":
      sendResponse({ selectedText });
      break;

    case "getPageContent":
      getPageContent(sendResponse);
      return true;
  }
}

/**
 * Handle text selection
 */
function handleTextSelection() {
  const selection = window.getSelection();

  if (selection.toString().trim().length > 0) {
    selectedText = selection.toString();
  }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcut(e) {
  // Alt+E for enhance
  if (e.altKey && e.key === "e") {
    enhanceContent();
  }

  // Alt+S for summarize
  if (e.altKey && e.key === "s") {
    summarizeContent();
  }

  // Alt+A for analyze
  if (e.altKey && e.key === "a") {
    analyzeContent();
  }
}

/**
 * Get page content
 */
function getPageContent(sendResponse) {
  // Check if we have selected text
  if (selectedText.length > 100) {
    currentContent = selectedText;
    sendResponse({ content: currentContent, source: "selection" });
    return;
  }

  // Find main content
  const article = findMainContent();

  if (article) {
    currentContent = article.innerText;
    sendResponse({
      content: currentContent,
      title: document.title,
      url: window.location.href,
      source: "article",
    });
  } else {
    // Fallback to body content
    currentContent = document.body.innerText;
    sendResponse({
      content: currentContent,
      title: document.title,
      url: window.location.href,
      source: "body",
    });
  }
}

/**
 * Find the main content element on the page
 */
function findMainContent() {
  // First, try to find common article elements
  const articleSelectors = [
    "article",
    '[role="article"]',
    ".post-content",
    ".article-content",
    ".entry-content",
    ".post-body",
    ".content-body",
    "#content",
    ".content",
    ".chapter-content",
    ".chapter-inner",
    ".chapter-text",
    ".chapter",
  ];

  for (const selector of articleSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
  }

  // Try to find the element with the most text
  let maxTextLength = 0;
  let mainElement = null;

  const contentElements = document.querySelectorAll("p, .p");
  const paragraphContainers = new Map();

  // Group paragraphs by their parent elements
  contentElements.forEach((el) => {
    const parent = el.parentElement;
    if (!paragraphContainers.has(parent)) {
      paragraphContainers.set(parent, 0);
    }

    paragraphContainers.set(
      parent,
      paragraphContainers.get(parent) + el.innerText.length
    );
  });

  // Find the parent with the most text content
  paragraphContainers.forEach((textLength, element) => {
    if (textLength > maxTextLength) {
      maxTextLength = textLength;
      mainElement = element;
    }
  });

  return mainElement;
}

/**
 * Enhance the content
 */
async function enhanceContent(sendResponse) {
  if (processingContent) {
    if (sendResponse)
      sendResponse({ success: false, error: "Already processing content" });
    return;
  }

  processingContent = true;

  try {
    // Get content if not already available
    if (!currentContent) {
      await new Promise((resolve) => getPageContent(resolve));
    }

    if (!currentContent || currentContent.length < 50) {
      if (sendResponse)
        sendResponse({ success: false, error: "No substantial content found" });
      processingContent = false;
      return;
    }

    // Get settings
    const { settings } = await new Promise((resolve) => {
      chrome.storage.sync.get("settings", resolve);
    });

    // Get prompt
    const { prompts } = await new Promise((resolve) => {
      chrome.storage.sync.get("prompts", resolve);
    });

    // Detect content type if not specified
    const contentType = detectContentType();

    // Prepare the API request
    const enhancePrompt =
      prompts?.[contentType]?.enhance ||
      "Enhance this text to improve readability and flow while preserving the original meaning.";

    // Send the API request (this would normally go through the background script)
    // Here, we're simulating the response for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Process the result
    const enhancedContent = `${currentContent}\n\n[Enhanced version would appear here in real implementation]`;

    // Display the result
    displayResult(enhancedContent, "enhanced");

    if (sendResponse) sendResponse({ success: true });
  } catch (error) {
    console.error("Error enhancing content:", error);
    if (sendResponse) sendResponse({ success: false, error: error.message });
  } finally {
    processingContent = false;
  }
}

/**
 * Summarize the content
 */
async function summarizeContent(sendResponse) {
  if (processingContent) {
    if (sendResponse)
      sendResponse({ success: false, error: "Already processing content" });
    return;
  }

  processingContent = true;

  try {
    // Get content if not already available
    if (!currentContent) {
      await new Promise((resolve) => getPageContent(resolve));
    }

    if (!currentContent || currentContent.length < 50) {
      if (sendResponse)
        sendResponse({ success: false, error: "No substantial content found" });
      processingContent = false;
      return;
    }

    // Get settings
    const { settings } = await new Promise((resolve) => {
      chrome.storage.sync.get("settings", resolve);
    });

    // Get prompt
    const { prompts } = await new Promise((resolve) => {
      chrome.storage.sync.get("prompts", resolve);
    });

    // Detect content type if not specified
    const contentType = detectContentType();

    // Prepare the API request
    const summarizePrompt =
      prompts?.[contentType]?.summary ||
      "Summarize this text, focusing on the main points and key information.";

    // Send the API request (this would normally go through the background script)
    // Here, we're simulating the response for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Process the result
    const summary = `[Summary would appear here in real implementation]\n\nThis text covers the following key points:\n- Point 1\n- Point 2\n- Point 3`;

    // Display the result
    displayResult(summary, "summary");

    if (sendResponse) sendResponse({ success: true });
  } catch (error) {
    console.error("Error summarizing content:", error);
    if (sendResponse) sendResponse({ success: false, error: error.message });
  } finally {
    processingContent = false;
  }
}

/**
 * Analyze the content
 */
async function analyzeContent(sendResponse) {
  if (processingContent) {
    if (sendResponse)
      sendResponse({ success: false, error: "Already processing content" });
    return;
  }

  processingContent = true;

  try {
    // Get content if not already available
    if (!currentContent) {
      await new Promise((resolve) => getPageContent(resolve));
    }

    if (!currentContent || currentContent.length < 50) {
      if (sendResponse)
        sendResponse({ success: false, error: "No substantial content found" });
      processingContent = false;
      return;
    }

    // Get settings
    const { settings } = await new Promise((resolve) => {
      chrome.storage.sync.get("settings", resolve);
    });

    // Get prompt
    const { prompts } = await new Promise((resolve) => {
      chrome.storage.sync.get("prompts", resolve);
    });

    // Detect content type if not specified
    const contentType = detectContentType();

    // Prepare the API request
    const analysisPrompt =
      prompts?.[contentType]?.analysis ||
      "Analyze this text focusing on: clarity, structure, style, and overall effectiveness of communication.";

    // Send the API request (this would normally go through the background script)
    // Here, we're simulating the response for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Process the result
    const analysis = `[Analysis would appear here in real implementation]\n\nStrengths:\n- Point 1\n- Point 2\n\nAreas for Improvement:\n- Point 1\n- Point 2\n\nOverall assessment: This content is well structured but could benefit from more concise language.`;

    // Display the result
    displayResult(analysis, "analysis");

    if (sendResponse) sendResponse({ success: true });
  } catch (error) {
    console.error("Error analyzing content:", error);
    if (sendResponse) sendResponse({ success: false, error: error.message });
  } finally {
    processingContent = false;
  }
}

/**
 * Detect the type of content on the page
 */
function detectContentType() {
  const url = window.location.href;
  const content = document.body.textContent;

  // Check for novel sites
  if (
    url.includes("royalroad.com") ||
    url.includes("wuxiaworld.com") ||
    url.includes("webnovel.com") ||
    url.includes("scribblehub.com") ||
    url.includes("novelupdates.com") ||
    (content &&
      content.length > 10000 &&
      /chapter|volume|book/i.test(document.title))
  ) {
    return "novels";
  }

  // Check for news sites
  if (
    url.includes("cnn.com") ||
    url.includes("bbc.com") ||
    url.includes("nytimes.com") ||
    url.includes("reuters.com") ||
    url.includes("theguardian.com") ||
    url.includes("news.") ||
    document.querySelector('article[data-category="news"]')
  ) {
    return "news";
  }

  // Check for learning sites
  if (
    url.includes("coursera.org") ||
    url.includes("udemy.com") ||
    url.includes("edx.org") ||
    url.includes("khanacademy.org") ||
    url.includes("study.") ||
    url.includes("learn.") ||
    url.includes("course.") ||
    document.querySelector(".course-content, .lesson-content")
  ) {
    return "learning";
  }

  // Default to general
  return "general";
}

/**
 * Display the result in a floating window
 */
function displayResult(content, type) {
  // Check if a result container already exists
  let resultContainer = document.querySelector(".novelsynth-result-container");

  if (!resultContainer) {
    // Create result container
    resultContainer = document.createElement("div");
    resultContainer.className = "novelsynth-result-container";
    resultContainer.dataset.persistDisplay = "true"; // Flag to prevent auto-closing

    // Add styles
    const styles = document.createElement("style");
    styles.textContent = `
      .novelsynth-result-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      @media (prefers-color-scheme: dark) {
        .novelsynth-result-container {
          background-color: #292a2d;
          color: #e8eaed;
        }

        .novelsynth-result-header {
          background-color: #202124;
        }
      }

      .novelsynth-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #ddd;
      }

      .novelsynth-result-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        font-size: 16px;
      }

      .novelsynth-result-actions {
        display: flex;
        gap: 8px;
      }

      .novelsynth-result-close,
      .novelsynth-result-copy {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .novelsynth-result-close:hover,
      .novelsynth-result-copy:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .novelsynth-result-content {
        padding: 16px;
        overflow-y: auto;
        flex: 1;
        line-height: 1.5;
        font-size: 15px;
        white-space: pre-wrap;
      }

      .novelsynth-result-footer {
        padding: 12px 16px;
        border-top: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #666;
      }
    `;

    document.head.appendChild(styles);

    // Create header
    const header = document.createElement("div");
    header.className = "novelsynth-result-header";

    const title = document.createElement("div");
    title.className = "novelsynth-result-title";

    // Set title based on type
    let titleText;
    switch (type) {
      case "enhanced":
        titleText = "Enhanced Content";
        break;
      case "summary":
        titleText = "Content Summary";
        break;
      case "analysis":
        titleText = "Content Analysis";
        break;
      default:
        titleText = "NovelSynth Result";
    }

    title.textContent = titleText;
    header.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "novelsynth-result-actions";

    const copyButton = document.createElement("button");
    copyButton.className = "novelsynth-result-copy";
    copyButton.title = "Copy to clipboard";
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
        <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    `;

    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(content).then(() => {
        copyButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4caf50" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        `;

        setTimeout(() => {
          copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          `;
        }, 2000);
      });
    });

    const closeButton = document.createElement("button");
    closeButton.className = "novelsynth-result-close";
    closeButton.title = "Close";
    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    `;

    closeButton.addEventListener("click", () => {
      resultContainer.remove();
    });

    actions.appendChild(copyButton);
    actions.appendChild(closeButton);
    header.appendChild(actions);

    // Create content area
    const contentArea = document.createElement("div");
    contentArea.className = "novelsynth-result-content";

    // Create footer
    const footer = document.createElement("div");
    footer.className = "novelsynth-result-footer";
    footer.innerHTML = `
      <div>Generated by NovelSynth</div>
      <div>${new Date().toLocaleString()}</div>
    `;

    // Add all elements to container
    resultContainer.appendChild(header);
    resultContainer.appendChild(contentArea);
    resultContainer.appendChild(footer);

    // Add to DOM
    document.body.appendChild(resultContainer);
  }

  // Update content
  const contentArea = resultContainer.querySelector(
    ".novelsynth-result-content"
  );
  contentArea.textContent = content;

  // Update header title
  const title = resultContainer.querySelector(".novelsynth-result-title");

  // Set title based on type
  let titleText;
  switch (type) {
    case "enhanced":
      titleText = "Enhanced Content";
      break;
    case "summary":
      titleText = "Content Summary";
      break;
    case "analysis":
      titleText = "Content Analysis";
      break;
    default:
      titleText = "NovelSynth Result";
  }

  title.textContent = titleText;

  // Update footer time
  const timeElement = resultContainer.querySelector(
    ".novelsynth-result-footer div:last-child"
  );
  timeElement.textContent = new Date().toLocaleString();
}

// Initialize the content script
initialize();
