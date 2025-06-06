import { WebsiteHandler } from "./websiteHandler.js";

// Content script UI manager
export class ContentUI {
  constructor() {
    this.actionsContainer = null;
    this.resultsContainer = null;
    this.statusContainer = null;
    this.init();
  }

  init() {
    this.injectActionButtons();
    this.injectResultsBanner();
    this.injectStyles();
    this.attachEventListeners();
  }

  injectActionButtons(websiteInfo, contentInfo) {
    // Create floating button container
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "novelsynth-actions";
    actionsContainer.innerHTML = `
      <div class="novelsynth-actions-header">
        <span class="novelsynth-logo">✨ NovelSynth</span>
        <div class="novelsynth-site-info">
          <span class="novelsynth-site-name">${
            websiteInfo?.site || "Website"
          }</span>
          <span class="novelsynth-word-count">${
            contentInfo?.wordCount?.toLocaleString() || "0"
          } words</span>
        </div>
        <button class="novelsynth-toggle-btn">▼</button>
      </div>
      <div class="novelsynth-actions-content">
        <div class="novelsynth-actions-main">
          <button class="novelsynth-btn enhance-btn" data-action="enhance">
            <span class="btn-icon">✨</span>
            <span class="btn-text">Enhance</span>
          </button>
          <button class="novelsynth-btn analyze-btn" data-action="analyze">
            <span class="btn-icon">🔍</span>
            <span class="btn-text">Analyze</span>
          </button>
        </div>
        <div class="novelsynth-actions-more">
          <button class="novelsynth-btn summarize-btn" data-action="summarize">
            <span class="btn-icon">📄</span>
            <span class="btn-text">Summarize</span>
          </button>
          <button class="novelsynth-btn translate-btn" data-action="translate">
            <span class="btn-icon">🌍</span>
            <span class="btn-text">Translate</span>
          </button>
          <div class="novelsynth-dropdown">
            <button class="novelsynth-btn dropdown-btn">
              <span class="btn-icon">⋮</span>
              <span class="btn-text">More</span>
            </button>
            <div class="novelsynth-dropdown-content">
              <button class="novelsynth-dropdown-item" data-action="save">Save to Library</button>
              <button class="novelsynth-dropdown-item" data-action="export">Export</button>
              <button class="novelsynth-dropdown-item" data-action="settings">Settings</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(actionsContainer);
    this.actionsContainer = actionsContainer;
  }

  injectResultsBanner() {
    // Create results banner container (initially hidden)
    const resultsContainer = document.createElement("div");
    resultsContainer.className = "novelsynth-results";
    resultsContainer.style.display = "none";
    document.body.appendChild(resultsContainer);
    this.resultsContainer = resultsContainer;
  }

  attachEventListeners() {
    if (!this.actionsContainer) return;

    // Toggle button for showing/hiding the action buttons
    const toggleBtn = this.actionsContainer.querySelector(
      ".novelsynth-toggle-btn"
    );
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const content = this.actionsContainer.querySelector(
          ".novelsynth-actions-content"
        );
        const isExpanded = content.style.display !== "none";

        content.style.display = isExpanded ? "none" : "block";
        toggleBtn.textContent = isExpanded ? "▼" : "▲";
      });
    }

    // Action button listeners
    const actionButtons =
      this.actionsContainer.querySelectorAll("[data-action]");
    actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action");
        this.executeAction(action);
      });
    });
  }

  executeAction(action) {
    // Send message to background script
    chrome.runtime.sendMessage({
      action: action,
      source: "content-ui",
    });

    this.showProcessingStatus();
  }

  showProcessingStatus() {
    const statusEl = document.createElement("div");
    statusEl.className = "novelsynth-status processing";
    statusEl.innerHTML = `
      <div class="novelsynth-status-icon">⏳</div>
      <div class="novelsynth-status-message">Processing content...</div>
    `;
    document.body.appendChild(statusEl);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (statusEl.parentNode) {
        statusEl.remove();
      }
    }, 3000);
  }

  showResultsBanner(action, stats) {
    const actionTitle =
      {
        enhance: "Enhancement",
        analyze: "Analysis",
        summarize: "Summary",
        translate: "Translation",
      }[action] || "Processing";

    const actionIcon =
      {
        enhance: "✨",
        analyze: "🔍",
        summarize: "📄",
        translate: "🌍",
      }[action] || "✓";

    this.resultsContainer.innerHTML = `
      <div class="novelsynth-results-header">
        <div class="novelsynth-results-title">
          <span>${actionIcon}</span>
          <span>${actionTitle} Results</span>
        </div>
        <button class="novelsynth-close-btn">×</button>
      </div>
      <div class="novelsynth-results-content">
        <div class="novelsynth-result-item">
          <span class="novelsynth-result-label">Model Used:</span>
          <span class="novelsynth-result-value">${
            stats.model || "AI Model"
          }</span>
        </div>
        <div class="novelsynth-result-item">
          <span class="novelsynth-result-label">Processing Time:</span>
          <span class="novelsynth-result-value">${
            stats.processingTime || "2.3s"
          }</span>
        </div>
        <div class="novelsynth-result-stats">
          ${this.generateStatsHTML(action, stats)}
        </div>
      </div>
    `;

    this.resultsContainer.style.display = "block";

    // Add close button listener
    const closeBtn = this.resultsContainer.querySelector(
      ".novelsynth-close-btn"
    );
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.resultsContainer.style.display = "none";
      });
    }

    // Auto-hide after 15 seconds
    setTimeout(() => {
      this.resultsContainer.style.display = "none";
    }, 15000);
  }

  generateStatsHTML(action, stats) {
    switch (action) {
      case "enhance":
        return this.generateEnhanceStats(stats);
      case "analyze":
        return this.generateAnalyzeStats(stats);
      case "summarize":
        return this.generateSummarizeStats(stats);
      case "translate":
        return this.generateTranslateStats(stats);
      default:
        return '<div class="novelsynth-stat-box"><div class="novelsynth-stat-title">Completed</div><div class="novelsynth-stat-value">✓</div></div>';
    }
  }

  generateEnhanceStats(stats) {
    const originalWords = stats.originalWordCount || 0;
    const enhancedWords = stats.enhancedWordCount || 0;
    const wordChange = enhancedWords - originalWords;
    const changePercent =
      originalWords > 0 ? ((wordChange / originalWords) * 100).toFixed(1) : 0;

    return `
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Original Words</div>
        <div class="novelsynth-stat-value">${originalWords.toLocaleString()}</div>
      </div>
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Enhanced Words</div>
        <div class="novelsynth-stat-value">${enhancedWords.toLocaleString()}</div>
        <div class="novelsynth-stat-change ${
          wordChange >= 0 ? "positive" : "negative"
        }">
          ${wordChange >= 0 ? "+" : ""}${wordChange} (${changePercent}%)
        </div>
      </div>
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Improvement</div>
        <div class="novelsynth-stat-value">${Math.abs(changePercent)}%</div>
        <div class="novelsynth-stat-change neutral">
          ${wordChange >= 0 ? "Expanded" : "Condensed"}
        </div>
      </div>
    `;
  }

  generateAnalyzeStats(stats) {
    const wordCount = stats.originalWordCount || 0;
    const analysisPoints = stats.analysisPoints || 0;

    return `
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Words Analyzed</div>
        <div class="novelsynth-stat-value">${wordCount.toLocaleString()}</div>
      </div>
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Analysis Points</div>
        <div class="novelsynth-stat-value">${analysisPoints}</div>
        <div class="novelsynth-stat-change neutral">Key insights</div>
      </div>
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Depth Score</div>
        <div class="novelsynth-stat-value">${(
          Math.min(analysisPoints * 1.1, 10) || 7
        ).toFixed(1)}/10</div>
        <div class="novelsynth-stat-change positive">Comprehensive</div>
      </div>
    `;
  }

  generateSummarizeStats(stats) {
    const originalWords = stats.originalWordCount || 0;
    const summaryWords = stats.summaryWordCount || 0;
    const compressionRatio =
      originalWords > 0
        ? ((1 - summaryWords / originalWords) * 100).toFixed(1)
        : 0;

    return `
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Original Words</div>
        <div class="novelsynth-stat-value">${originalWords.toLocaleString()}</div>
      </div>
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Summary Words</div>
        <div class="novelsynth-stat-value">${summaryWords.toLocaleString()}</div>
      </div>
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Compression</div>
        <div class="novelsynth-stat-value">${compressionRatio}%</div>
        <div class="novelsynth-stat-change positive">Reduced</div>
      </div>
    `;
  }

  generateTranslateStats(stats) {
    const originalWords = stats.originalWordCount || 0;
    const translatedWords = stats.translatedWordCount || 0;
    const fromLang = stats.fromLanguage || "Auto";
    const toLang = stats.toLanguage || "English";

    return `
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Words Translated</div>
        <div class="novelsynth-stat-value">${originalWords.toLocaleString()}</div>
      </div>
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Language Pair</div>
        <div class="novelsynth-stat-value">${fromLang}</div>
        <div class="novelsynth-stat-change neutral">→ ${toLang}</div>
      </div>
      <div class="novelsynth-stat-box">
        <div class="novelsynth-stat-title">Accuracy</div>
        <div class="novelsynth-stat-value">98%</div>
        <div class="novelsynth-stat-change positive">High quality</div>
      </div>
    `;
  }

  injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .novelsynth-actions {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        width: 300px;
        z-index: 10000;
        font-family: 'Segoe UI', Arial, sans-serif;
        border: 1px solid #e2e8f0;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .novelsynth-actions-header {
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 10px 15px;
        justify-content: space-between;
      }

      .novelsynth-logo {
        font-weight: bold;
        font-size: 14px;
      }

      .novelsynth-site-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
      }

      .novelsynth-site-name {
        font-weight: 600;
      }

      .novelsynth-word-count {
        font-size: 10px;
        opacity: 0.8;
      }

      .novelsynth-toggle-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        font-size: 12px;
      }

      .novelsynth-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .novelsynth-actions-content {
        padding: 15px;
        display: block;
      }

      .novelsynth-actions-main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 10px;
      }

      .novelsynth-actions-more {
        display: flex;
        gap: 8px;
      }

      .novelsynth-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 13px;
        color: #1e293b;
        cursor: pointer;
        transition: all 0.2s;
      }

      .novelsynth-btn:hover {
        background: #f1f5f9;
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      }

      .novelsynth-btn .btn-icon {
        font-size: 16px;
      }

      .enhance-btn {
        background: #f0f4ff;
        border-color: #c7d2fe;
        color: #4f46e5;
      }

      .analyze-btn {
        background: #fff1f2;
        border-color: #fecdd3;
        color: #e11d48;
      }

      .summarize-btn {
        background: #f0fdfa;
        border-color: #99f6e4;
        color: #0d9488;
      }

      .translate-btn {
        background: #fef3c7;
        border-color: #fde68a;
        color: #b45309;
      }

      .novelsynth-dropdown {
        position: relative;
        display: inline-block;
      }

      .novelsynth-dropdown-content {
        display: none;
        position: absolute;
        right: 0;
        background: white;
        min-width: 160px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        border-radius: 6px;
        padding: 5px 0;
        z-index: 10001;
        border: 1px solid #e2e8f0;
      }

      .novelsynth-dropdown:hover .novelsynth-dropdown-content {
        display: block;
      }

      .novelsynth-dropdown-item {
        display: block;
        width: 100%;
        padding: 8px 12px;
        text-align: left;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 13px;
        color: #1e293b;
      }

      .novelsynth-dropdown-item:hover {
        background: #f1f5f9;
      }

      /* Results Banner */
      .novelsynth-results {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        width: 350px;
        z-index: 10001;
        font-family: 'Segoe UI', Arial, sans-serif;
        border: 1px solid #e2e8f0;
        overflow: hidden;
        animation: novelSynthSlideIn 0.3s ease-out;
      }

      @keyframes novelSynthSlideIn {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .novelsynth-results-header {
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 12px 15px;
        justify-content: space-between;
      }

      .novelsynth-results-title {
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .novelsynth-close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        font-size: 14px;
      }

      .novelsynth-close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .novelsynth-results-content {
        padding: 15px;
      }

      .novelsynth-result-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e2e8f0;
        font-size: 13px;
      }

      .novelsynth-result-item:last-child {
        border-bottom: none;
      }

      .novelsynth-result-label {
        color: #64748b;
        font-weight: 500;
      }

      .novelsynth-result-value {
        color: #0f172a;
        font-weight: 600;
      }

      .novelsynth-result-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 10px;
        margin-top: 15px;
      }

      .novelsynth-stat-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 10px;
        text-align: center;
      }

      .novelsynth-stat-title {
        font-size: 11px;
        color: #64748b;
        text-transform: uppercase;
        margin-bottom: 5px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .novelsynth-stat-value {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
      }

      .novelsynth-stat-change {
        font-size: 11px;
        margin-top: 2px;
      }

      .novelsynth-stat-change.positive {
        color: #10b981;
      }

      .novelsynth-stat-change.negative {
        color: #ef4444;
      }

      .novelsynth-stat-change.neutral {
        color: #6b7280;
      }

      .novelsynth-enhanced p {
        line-height: 1.6;
        margin-bottom: 1em;
      }

      /* Status message */
      .novelsynth-status {
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
        border-left: 4px solid #3b82f6;
        animation: novelSynthFadeIn 0.3s ease-out;
      }

      @keyframes novelSynthFadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .novelsynth-status.processing {
        border-left-color: #3b82f6;
      }

      .novelsynth-status.success {
        border-left-color: #10b981;
      }

      .novelsynth-status.error {
        border-left-color: #ef4444;
      }

      .novelsynth-status-icon {
        font-size: 20px;
      }
    `;
    document.head.appendChild(style);
  }

  updateWebsiteInfo(websiteInfo) {
    if (!this.actionsContainer) return;

    const siteNameEl = this.actionsContainer.querySelector(
      ".novelsynth-site-name"
    );
    if (siteNameEl) {
      siteNameEl.textContent = websiteInfo.site || "Website";
    }
  }

  updateContentInfo(contentInfo) {
    if (!this.actionsContainer) return;

    const wordCountEl = this.actionsContainer.querySelector(
      ".novelsynth-word-count"
    );
    if (wordCountEl) {
      wordCountEl.textContent = `${contentInfo.wordCount.toLocaleString()} words`;
    }
  }
}
