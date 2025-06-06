/**
 * FloatingUI component for NovelSynth
 * Provides quick access to settings and controls from the bottom right corner of the page
 */

import "./FloatingUI.css";

class FloatingUI {
  constructor() {
    this.container = null;
    this.visible = false;
    this.currentWebsiteType = "general"; // Default to general type
    this.settingsVisible = false;
    this.dragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.detectWebsiteType();
  }
  /**
   * Initialize the floating UI
   */
  init() {
    // Create main container
    this.container = document.createElement("div");
    this.container.className = "novelsynth-floating-ui";
    this.container.id = "novelsynth-floating-ui";

    // Create main button
    this.createMainButton();

    // Create panel content
    this.createPanelContent();

    // Add to DOM
    document.body.appendChild(this.container);

    // Set up event listeners
    this.setupEventListeners();

    // Load settings
    this.loadSettings();
  }

  /**
   * Handle clicks outside the floating UI
   */
  handleClickOutside(event) {
    // If the panel is visible and the click is outside the container
    if (
      this.panelVisible &&
      this.container &&
      !this.container.contains(event.target)
    ) {
      // Check if click is on the result container
      const resultContainer = document.querySelector(
        ".novelsynth-result-container"
      );
      if (!resultContainer || !resultContainer.contains(event.target)) {
        // Hide the panel, but not the result container
        this.togglePanel(false);
        event.stopPropagation();
      }
    }
  }

  /**
   * Create the main floating button
   */
  createMainButton() {
    const button = document.createElement("div");
    button.className = "novelsynth-main-button";
    button.innerHTML = `
      <div class="novelsynth-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm.5-8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
        </svg>
      </div>
      <div class="novelsynth-status">
        <span class="novelsynth-status-dot"></span>
      </div>
    `;

    this.container.appendChild(button);
    this.mainButton = button;
  }

  /**
   * Create the panel content
   */
  createPanelContent() {
    const panel = document.createElement("div");
    panel.className = "novelsynth-panel";
    panel.innerHTML = `
      <div class="novelsynth-panel-header">
        <div class="novelsynth-panel-title">
          <img src="${chrome.runtime.getURL(
            "icons/icon32.svg"
          )}" alt="NovelSynth" />
          <h3>NovelSynth</h3>
        </div>
        <div class="novelsynth-panel-actions">
          <button class="novelsynth-settings-toggle" title="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
          <button class="novelsynth-close-panel" title="Close">×</button>
        </div>
      </div>

      <div class="novelsynth-panel-content">
        <div class="novelsynth-main-view">
          <div class="novelsynth-content-type">
            <div class="novelsynth-badge" id="novelsynth-content-type-badge">General</div>
          </div>

          <div class="novelsynth-action-buttons">
            <button id="novelsynth-enhance-btn" class="novelsynth-action-btn primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Enhance
            </button>
            <button id="novelsynth-summarize-btn" class="novelsynth-action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/>
              </svg>
              Summarize
            </button>
            <button id="novelsynth-analyze-btn" class="novelsynth-action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              Analyze
            </button>
          </div>

          <div class="novelsynth-quick-settings">
            <div class="novelsynth-slider-setting">
              <label>
                Temperature
                <span class="novelsynth-value" id="novelsynth-temperature-value">0.7</span>
              </label>
              <input type="range" min="0" max="1" step="0.1" value="0.7" id="novelsynth-temperature-slider">
            </div>

            <div class="novelsynth-model-select">
              <label for="novelsynth-model-select">Model</label>
              <select id="novelsynth-model-select">
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4o" selected>GPT-4o</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
              </select>
            </div>
          </div>

          <div class="novelsynth-progress" id="novelsynth-progress" style="display: none;">
            <div class="novelsynth-progress-bar" id="novelsynth-progress-bar"></div>
            <div class="novelsynth-progress-text" id="novelsynth-progress-text">Processing...</div>
          </div>
        </div>

        <div class="novelsynth-settings-view" style="display: none;">
          <h4>Settings</h4>

          <div class="novelsynth-setting-group">
            <h5>Prompt Settings</h5>

            <div class="novelsynth-setting">
              <label for="novelsynth-prompt-type">Content Type</label>
              <select id="novelsynth-prompt-type">
                <option value="novels">Novels</option>
                <option value="news">News</option>
                <option value="learning">Learning</option>
                <option value="general">General</option>
              </select>
            </div>

            <div class="novelsynth-setting">
              <label for="novelsynth-custom-prompt">Custom Prompt</label>
              <textarea id="novelsynth-custom-prompt" rows="3" placeholder="Enter your custom instructions here..."></textarea>
              <button id="novelsynth-reset-prompt" class="novelsynth-small-btn">Reset to Default</button>
            </div>
          </div>

          <div class="novelsynth-setting-group">
            <h5>Advanced Options</h5>

            <div class="novelsynth-setting">
              <label>
                <input type="checkbox" id="novelsynth-chunking-enabled" checked>
                Split large content
              </label>
            </div>

            <div class="novelsynth-setting">
              <label>
                <input type="checkbox" id="novelsynth-emoji-enabled">
                Add emotional emojis
              </label>
            </div>

            <div class="novelsynth-slider-setting">
              <label>
                Max Output Length
                <span class="novelsynth-value" id="novelsynth-max-tokens-value">8192</span>
              </label>
              <input type="range" min="1000" max="16000" step="1000" value="8192" id="novelsynth-max-tokens-slider">
            </div>
          </div>

          <div class="novelsynth-setting-actions">
            <button id="novelsynth-open-full-settings" class="novelsynth-small-btn">Open Full Settings</button>
            <button id="novelsynth-save-settings" class="novelsynth-small-btn primary">Save Settings</button>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(panel);
    this.panel = panel;
  }
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Main button click
    this.mainButton.addEventListener("click", () => {
      this.togglePanel();
    });

    // Make main button draggable
    this.mainButton.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return; // Only left click
      this.startDrag(e);
    });

    document.addEventListener("mousemove", (e) => {
      if (this.dragging) {
        this.drag(e);
      }
    });

    document.addEventListener("mouseup", () => {
      if (this.dragging) {
        this.stopDrag();
      }
    });

    // Document click to close panel but not results
    document.addEventListener("click", (e) => {
      // If panel is visible and click is outside container
      if (this.panelVisible && !this.container.contains(e.target)) {
        // Check if it's also not on the result container
        const resultContainer = document.querySelector(
          ".novelsynth-result-container"
        );
        if (!resultContainer || !resultContainer.contains(e.target)) {
          this.hidePanel();
        }
      }
    });

    // Panel buttons
    const closeButton = this.panel.querySelector(".novelsynth-close-panel");
    closeButton.addEventListener("click", () => {
      this.hidePanel();
    });

    const settingsToggle = this.panel.querySelector(
      ".novelsynth-settings-toggle"
    );
    settingsToggle.addEventListener("click", () => {
      this.toggleSettings();
    });

    // Action buttons
    const enhanceBtn = this.panel.querySelector("#novelsynth-enhance-btn");
    enhanceBtn.addEventListener("click", () => {
      this.enhanceContent();
    });

    const summarizeBtn = this.panel.querySelector("#novelsynth-summarize-btn");
    summarizeBtn.addEventListener("click", () => {
      this.summarizeContent();
    });

    const analyzeBtn = this.panel.querySelector("#novelsynth-analyze-btn");
    analyzeBtn.addEventListener("click", () => {
      this.analyzeContent();
    });

    // Quick settings
    const temperatureSlider = this.panel.querySelector(
      "#novelsynth-temperature-slider"
    );
    temperatureSlider.addEventListener("input", (e) => {
      this.updateTemperatureValue(e.target.value);
    });

    // Settings view
    const openFullSettings = this.panel.querySelector(
      "#novelsynth-open-full-settings"
    );
    openFullSettings.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openPopup" });
    });

    const saveSettings = this.panel.querySelector("#novelsynth-save-settings");
    saveSettings.addEventListener("click", () => {
      this.saveSettings();
    });

    const resetPrompt = this.panel.querySelector("#novelsynth-reset-prompt");
    resetPrompt.addEventListener("click", () => {
      this.resetPromptToDefault();
    });

    const promptType = this.panel.querySelector("#novelsynth-prompt-type");
    promptType.addEventListener("change", (e) => {
      this.changePromptType(e.target.value);
    });
  }

  /**
   * Toggle the panel visibility
   * @param {boolean} [show] - Force panel to show or hide
   */
  togglePanel(show) {
    const panel = this.container.querySelector(".novelsynth-panel");
    if (!panel) return;

    // If show is provided, set panel visibility to that value
    if (typeof show !== "undefined") {
      this.panelVisible = show;
      panel.style.display = show ? "block" : "none";

      // Also toggle the active class on the main button
      const button = this.container.querySelector(".novelsynth-main-button");
      if (button) {
        if (show) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      }
      return;
    }

    // Toggle panel visibility
    this.panelVisible = !this.panelVisible;
    panel.style.display = this.panelVisible ? "block" : "none";

    // Also toggle the active class on the main button
    const button = this.container.querySelector(".novelsynth-main-button");
    if (button) {
      button.classList.toggle("active", this.panelVisible);
    }
  }

  /**
   * Show the panel
   */
  showPanel() {
    this.togglePanel(true);
  }

  /**
   * Hide the panel
   */
  hidePanel() {
    this.togglePanel(false);

    // Also hide settings if open
    if (this.settingsVisible) {
      this.toggleSettings();
    }
  }

  /**
   * Toggle settings view
   */
  toggleSettings() {
    const mainView = this.panel.querySelector(".novelsynth-main-view");
    const settingsView = this.panel.querySelector(".novelsynth-settings-view");

    if (this.settingsVisible) {
      mainView.style.display = "block";
      settingsView.style.display = "none";
      this.settingsVisible = false;
    } else {
      mainView.style.display = "none";
      settingsView.style.display = "block";
      this.settingsVisible = true;
    }
  }

  /**
   * Start dragging the button
   */
  startDrag(e) {
    this.dragging = true;
    const rect = this.mainButton.getBoundingClientRect();
    this.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    this.mainButton.classList.add("dragging");
  }

  /**
   * Handle dragging
   */
  drag(e) {
    if (!this.dragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    // Keep button within viewport
    const buttonSize = this.mainButton.offsetWidth;
    const maxX = window.innerWidth - buttonSize;
    const maxY = window.innerHeight - buttonSize;

    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));

    this.container.style.setProperty("--button-position-x", `${boundedX}px`);
    this.container.style.setProperty("--button-position-y", `${boundedY}px`);
  }

  /**
   * Stop dragging
   */
  stopDrag() {
    this.dragging = false;
    this.mainButton.classList.remove("dragging");

    // Save position
    const style = getComputedStyle(this.container);
    const x = style.getPropertyValue("--button-position-x");
    const y = style.getPropertyValue("--button-position-y");

    chrome.storage.local.set({
      floatingButtonPosition: { x, y },
    });
  }

  /**
   * Detect website type
   */
  detectWebsiteType() {
    // Simple detection based on URL and page content
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
      this.currentWebsiteType = "novels";
      return;
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
      this.currentWebsiteType = "news";
      return;
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
      this.currentWebsiteType = "learning";
      return;
    }

    // Default to general
    this.currentWebsiteType = "general";
  }

  /**
   * Update temperature display value
   */
  updateTemperatureValue(value) {
    const valueDisplay = this.panel.querySelector(
      "#novelsynth-temperature-value"
    );
    valueDisplay.textContent = value;
  }

  /**
   * Load settings from storage
   */
  async loadSettings() {
    try {
      // Get settings from storage
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get(["settings", "prompts"], resolve);
      });

      const settings = data.settings || {};
      const prompts = data.prompts || {};

      // Get floating button position
      const posData = await new Promise((resolve) => {
        chrome.storage.local.get(["floatingButtonPosition"], resolve);
      });

      // Apply settings to UI
      if (settings.temperature) {
        const slider = this.panel.querySelector(
          "#novelsynth-temperature-slider"
        );
        slider.value = settings.temperature;
        this.updateTemperatureValue(settings.temperature);
      }

      if (settings.model) {
        const modelSelect = this.panel.querySelector(
          "#novelsynth-model-select"
        );
        if (modelSelect.querySelector(`option[value="${settings.model}"]`)) {
          modelSelect.value = settings.model;
        }
      }

      if (settings.maxOutputTokens) {
        const slider = this.panel.querySelector(
          "#novelsynth-max-tokens-slider"
        );
        const valueDisplay = this.panel.querySelector(
          "#novelsynth-max-tokens-value"
        );
        slider.value = settings.maxOutputTokens;
        valueDisplay.textContent = settings.maxOutputTokens;
      }

      if (typeof settings.chunkingEnabled !== "undefined") {
        const checkbox = this.panel.querySelector(
          "#novelsynth-chunking-enabled"
        );
        checkbox.checked = settings.chunkingEnabled;
      }

      if (typeof settings.useEmoji !== "undefined") {
        const checkbox = this.panel.querySelector("#novelsynth-emoji-enabled");
        checkbox.checked = settings.useEmoji;
      }

      // Set content type based on website detection
      const promptTypeSelect = this.panel.querySelector(
        "#novelsynth-prompt-type"
      );
      promptTypeSelect.value = this.currentWebsiteType;

      // Update badge
      const badge = this.panel.querySelector("#novelsynth-content-type-badge");
      badge.textContent =
        this.currentWebsiteType.charAt(0).toUpperCase() +
        this.currentWebsiteType.slice(1);

      // Set custom prompt if available
      if (
        prompts &&
        prompts[this.currentWebsiteType] &&
        prompts[this.currentWebsiteType].enhance
      ) {
        const customPrompt = this.panel.querySelector(
          "#novelsynth-custom-prompt"
        );
        customPrompt.value = prompts[this.currentWebsiteType].enhance;
      }

      // Set button position if available
      if (posData.floatingButtonPosition) {
        const { x, y } = posData.floatingButtonPosition;
        this.container.style.setProperty("--button-position-x", x);
        this.container.style.setProperty("--button-position-y", y);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  /**
   * Save settings to storage
   */
  async saveSettings() {
    try {
      // Get values from UI
      const temperature = parseFloat(
        this.panel.querySelector("#novelsynth-temperature-slider").value
      );
      const model = this.panel.querySelector("#novelsynth-model-select").value;
      const maxOutputTokens = parseInt(
        this.panel.querySelector("#novelsynth-max-tokens-slider").value
      );
      const chunkingEnabled = this.panel.querySelector(
        "#novelsynth-chunking-enabled"
      ).checked;
      const useEmoji = this.panel.querySelector(
        "#novelsynth-emoji-enabled"
      ).checked;
      const promptType = this.panel.querySelector(
        "#novelsynth-prompt-type"
      ).value;
      const customPrompt = this.panel.querySelector(
        "#novelsynth-custom-prompt"
      ).value;

      // Get existing settings and prompts
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get(["settings", "prompts"], resolve);
      });

      const settings = data.settings || {};
      const prompts = data.prompts || {};

      // Update settings
      settings.temperature = temperature;
      settings.model = model;
      settings.maxOutputTokens = maxOutputTokens;
      settings.chunkingEnabled = chunkingEnabled;
      settings.useEmoji = useEmoji;

      // Update prompts
      if (!prompts[promptType]) {
        prompts[promptType] = {};
      }
      prompts[promptType].enhance = customPrompt;

      // Save to storage
      await new Promise((resolve) => {
        chrome.storage.sync.set({ settings, prompts }, resolve);
      });

      // Show success message
      this.showNotification("Settings saved successfully", "success");
    } catch (error) {
      console.error("Error saving settings:", error);
      this.showNotification("Error saving settings", "error");
    }
  }

  /**
   * Reset prompt to default
   */
  resetPromptToDefault() {
    const promptType = this.panel.querySelector(
      "#novelsynth-prompt-type"
    ).value;
    const defaultPrompts = {
      novels:
        "Enhance this text to improve readability and flow while preserving the original meaning. Fix grammar, punctuation, and awkward phrasing. Make the narrative more engaging and natural-sounding.",
      news: "Enhance this news article to improve clarity and readability while preserving all factual information. Fix grammar, punctuation, and awkward phrasing. Maintain the journalistic tone.",
      learning:
        "Enhance this educational content to improve clarity and readability while preserving all instructional information. Make complex concepts easier to understand without oversimplifying.",
      general:
        "Enhance this text to improve readability and flow while preserving the original meaning. Fix grammar, punctuation, and awkward phrasing. Make the writing more clear and engaging.",
    };

    const customPrompt = this.panel.querySelector("#novelsynth-custom-prompt");
    customPrompt.value = defaultPrompts[promptType] || defaultPrompts.general;
  }

  /**
   * Change prompt type
   */
  changePromptType(type) {
    this.currentWebsiteType = type;

    // Update badge
    const badge = this.panel.querySelector("#novelsynth-content-type-badge");
    badge.textContent = type.charAt(0).toUpperCase() + type.slice(1);

    // Load prompt for this type
    chrome.storage.sync.get("prompts", (data) => {
      const prompts = data.prompts || {};
      const customPrompt = this.panel.querySelector(
        "#novelsynth-custom-prompt"
      );

      if (prompts[type] && prompts[type].enhance) {
        customPrompt.value = prompts[type].enhance;
      } else {
        // Reset to default for this type
        this.resetPromptToDefault();
      }
    });
  }

  /**
   * Enhance content
   */
  enhanceContent() {
    this.processContent("enhance");
  }

  /**
   * Summarize content
   */
  summarizeContent() {
    this.processContent("summarize");
  }

  /**
   * Analyze content
   */
  analyzeContent() {
    this.processContent("analyze");
  }

  /**
   * Process content with specified action
   */
  processContent(action) {
    // Show progress bar
    const progress = this.panel.querySelector("#novelsynth-progress");
    const progressBar = this.panel.querySelector("#novelsynth-progress-bar");
    const progressText = this.panel.querySelector("#novelsynth-progress-text");

    progress.style.display = "block";
    progressBar.style.width = "5%";

    switch (action) {
      case "enhance":
        progressText.textContent = "Enhancing content...";
        break;
      case "summarize":
        progressText.textContent = "Summarizing content...";
        break;
      case "analyze":
        progressText.textContent = "Analyzing content...";
        break;
    }

    // Simulate progress
    let progressValue = 5;
    const progressInterval = setInterval(() => {
      if (progressValue < 90) {
        progressValue += Math.random() * 10;
        progressBar.style.width = `${progressValue}%`;
      }
    }, 1000);

    // Send message to background script
    chrome.runtime.sendMessage(
      {
        action: action + "Content",
        settings: {
          temperature: parseFloat(
            this.panel.querySelector("#novelsynth-temperature-slider").value
          ),
          model: this.panel.querySelector("#novelsynth-model-select").value,
          maxOutputTokens: parseInt(
            this.panel.querySelector("#novelsynth-max-tokens-slider").value
          ),
          chunkingEnabled: this.panel.querySelector(
            "#novelsynth-chunking-enabled"
          ).checked,
          useEmoji: this.panel.querySelector("#novelsynth-emoji-enabled")
            .checked,
          promptType: this.currentWebsiteType,
        },
      },
      (response) => {
        clearInterval(progressInterval);

        if (response && response.success) {
          progressBar.style.width = "100%";
          progressText.textContent = "Complete!";

          setTimeout(() => {
            progress.style.display = "none";
          }, 1500);

          this.showNotification("Content processed successfully", "success");
        } else {
          progressBar.style.width = "100%";
          progressText.textContent = "Error!";
          progressBar.classList.add("error");

          setTimeout(() => {
            progress.style.display = "none";
            progressBar.classList.remove("error");
          }, 3000);

          this.showNotification(
            response?.error || "Error processing content",
            "error"
          );
        }
      }
    );
  }

  /**
   * Show a notification
   */
  showNotification(message, type = "info") {
    // Check if notification element exists
    let notification = document.querySelector(".novelsynth-notification");

    if (!notification) {
      notification = document.createElement("div");
      notification.className = "novelsynth-notification";
      document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = "novelsynth-notification";
    notification.classList.add(`novelsynth-notification-${type}`);
    notification.classList.add("visible");

    setTimeout(() => {
      notification.classList.remove("visible");
    }, 3000);
  }
}

export default FloatingUI;
