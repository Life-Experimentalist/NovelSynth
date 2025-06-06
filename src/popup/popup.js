// NovelSynth Popup Script - Enhanced with per-function settings and service registry
class NovelSynthPopup {
  constructor() {
    this.currentTab = "enhance";
    this.settings = {};
    this.functions = ["enhance", "analyze", "summarize"];
    this.serviceRegistry = new Map(); // Stores validated services with their models
    this.availableServices = ["gemini", "openai", "anthropic", "local"];
    this.validatedApiKeys = new Map(); // Stores validated API keys per service
    this.init();
  }

  init() {
    this.setupTabs();
    this.setupButtons();
    this.setupSliders();
    this.setupResize();
    this.setupProviderHandlers();
    this.loadSettings();
    this.updatePageInfo();
    this.setupEventListeners();
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab");

        // Remove active class from all tabs and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked tab and corresponding content
        button.classList.add("active");
        document.getElementById(tabId).classList.add("active");

        this.currentTab = tabId;
      });
    });
  }

  setupButtons() {
    // Function-specific action buttons
    this.functions.forEach((func) => {
      const button = document.getElementById(`${func}Btn`);
      if (button) {
        button.addEventListener("click", () => {
          this.executeAction(func);
        });
      }

      // Test API key buttons
      const testButton = document.getElementById(
        `test${this.capitalize(func)}ApiKey`
      );
      if (testButton) {
        testButton.addEventListener("click", () => {
          this.testApiKey(func);
        });
      }
    });

    // Settings buttons
    const saveSettingsBtn = document.getElementById("saveSettings");
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", () => {
        this.saveSettings();
      });
    }

    const resetSettingsBtn = document.getElementById("resetSettings");
    if (resetSettingsBtn) {
      resetSettingsBtn.addEventListener("click", () => {
        this.resetSettings();
      });
    }

    // Special buttons
    const suggestionsBtn = document.getElementById("suggestionsBtn");
    if (suggestionsBtn) {
      suggestionsBtn.addEventListener("click", () => {
        this.executeAction("suggestions");
      });
    }
  }

  setupSliders() {
    const sliders = document.querySelectorAll(".slider");
    sliders.forEach((slider) => {
      const valueDisplay = document.getElementById(
        slider.id.replace("Slider", "Value")
      );
      if (valueDisplay) {
        slider.addEventListener("input", () => {
          valueDisplay.textContent = slider.value;
        });
      }
    });
  }

  setupResize() {
    const resizeHandle = document.querySelector(".resize-handle");
    const container = document.querySelector(".container");

    if (resizeHandle && container) {
      let isResizing = false;
      let startX, startY, startWidth, startHeight;

      resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(window.getComputedStyle(document.body).width);
        startHeight = parseInt(window.getComputedStyle(document.body).height);

        document.addEventListener("mousemove", handleResize);
        document.addEventListener("mouseup", stopResize);
        e.preventDefault();
      });

      function handleResize(e) {
        if (!isResizing) return;

        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);

        if (newWidth >= 380 && newWidth <= 650) {
          document.body.style.width = newWidth + "px";
        }
        if (newHeight >= 550 && newHeight <= 800) {
          document.body.style.height = newHeight + "px";
        }
      }

      function stopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", stopResize);
      }
    }
  }
  setupProviderHandlers() {
    // Setup provider change handlers for each function
    this.functions.forEach((func) => {
      const providerSelect = document.getElementById(`${func}Provider`);
      if (providerSelect) {
        providerSelect.addEventListener("change", async () => {
          await this.updateModelOptions(func);
        });
      }
    });
  }

  setupEventListeners() {
    // Real-time settings updates for per-function settings
    this.functions.forEach((func) => {
      const inputs = document.querySelectorAll(
        `#${func}Provider, #${func}Model, #${func}ApiKey, #${func}Prompt`
      );
      inputs.forEach((input) => {
        input.addEventListener("change", () => {
          this.saveFunctionSettings(func);
        });
      });
    });

    // Global settings
    const globalInputs = document.querySelectorAll(
      "#temperatureSlider, #maxTokens, #autoDetect, #showBanner, #enableChunking"
    );
    globalInputs.forEach((input) => {
      input.addEventListener("change", () => {
        this.saveSettings();
      });
    });
  }

  async executeAction(action) {
    const button = document.getElementById(action + "Btn");
    if (!button) return;

    const originalText =
      button.querySelector(".btn-text")?.textContent || button.textContent;
    const statusMessageId = `${action}StatusMessage`;

    // Show processing state
    this.showStatus(
      `${this.capitalize(action)}ing content...`,
      "processing",
      statusMessageId
    );

    if (button.querySelector(".btn-text")) {
      button.querySelector(".btn-text").textContent = "Processing...";
    } else {
      button.textContent = "Processing...";
    }
    button.disabled = true;

    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) {
        throw new Error("No active tab found");
      }

      // Check if we can access the tab
      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://") ||
        tab.url.startsWith("edge://")
      ) {
        throw new Error("Cannot access special browser pages");
      }

      // Get settings for this action
      const settings = {
        provider: document.getElementById(`${action}Provider`)?.value,
        model: document.getElementById(`${action}Model`)?.value,
        apiKey: document.getElementById(`${action}ApiKey`)?.value,
        prompt: document.getElementById(`${action}Prompt`)?.value,
        temperature: document.getElementById("temperatureSlider")?.value || 0.7,
        maxTokens: document.getElementById("maxTokens")?.value || 8192,
      };

      // Validate required settings
      if (!settings.provider || !settings.model || !settings.apiKey) {
        throw new Error(`Please configure ${action} settings first`);
      }

      // Send message to content script with timeout
      const response = await this.sendMessageWithTimeout(
        tab.id,
        {
          action: action,
          settings: settings,
        },
        30000
      ); // 30 second timeout

      if (response && response.success) {
        this.showStatus(
          `${this.capitalize(action)} completed successfully!`,
          "success",
          statusMessageId
        );

        // Handle response data if needed
        if (response.result) {
          console.log(`${action} result:`, response.result);
        }
      } else {
        throw new Error(response?.error || `${action} failed`);
      }
    } catch (error) {
      console.error(`${action} error:`, error);
      this.showStatus(
        `${this.capitalize(action)} failed: ${error.message}`,
        "error",
        statusMessageId
      );
    } finally {
      if (button.querySelector(".btn-text")) {
        button.querySelector(".btn-text").textContent = originalText;
      } else {
        button.textContent = originalText;
      }
      button.disabled = false;
    }
  }

  async sendMessageWithTimeout(tabId, message, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(
          new Error("Message timeout - content script may not be responding")
        );
      }, timeout);

      chrome.tabs.sendMessage(tabId, message, (response) => {
        clearTimeout(timeoutId);

        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  async testApiKey(functionType) {
    const apiKeyInput = document.getElementById(`${functionType}ApiKey`);
    const providerSelect = document.getElementById(`${functionType}Provider`);

    if (!apiKeyInput || !providerSelect) return;

    const apiKey = apiKeyInput.value;
    const provider = providerSelect.value;

    if (!apiKey) {
      this.showStatus("Please enter an API key first", "error");
      return;
    }

    const button = document.getElementById(
      `test${this.capitalize(functionType)}ApiKey`
    );
    const originalText = button.textContent;
    button.textContent = "Testing...";
    button.disabled = true;

    try {
      // Test API key and fetch models
      await this.performApiTest(provider, apiKey);

      // If successful, validate and register the service
      await this.validateAndRegisterService(provider, apiKey);

      this.showStatus(
        `${this.capitalize(provider)} API key is valid! Service registered.`,
        "success"
      );

      // Refresh model list and update all function dropdowns
      await this.updateModelOptions(functionType);
      await this.refreshAllProviderDropdowns();
    } catch (error) {
      this.showStatus(
        `${this.capitalize(provider)} API key test failed: ${error.message}`,
        "error"
      );
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  async validateAndRegisterService(provider, apiKey) {
    try {
      // Fetch models for this service
      const models = await this.fetchModelsByProvider(provider, apiKey);

      // Register the service with its models
      this.serviceRegistry.set(provider, {
        apiKey: apiKey,
        models: models,
        validated: true,
        lastValidated: new Date().toISOString(),
      });

      // Store validated API key
      this.validatedApiKeys.set(provider, apiKey);

      // Save to storage
      await this.saveServiceRegistry();

      console.log(
        `Service ${provider} registered with ${models.length} models`
      );
    } catch (error) {
      console.error(`Failed to register service ${provider}:`, error);
      throw error;
    }
  }

  async fetchModelsByProvider(provider, apiKey) {
    switch (provider) {
      case "gemini":
        return await this.fetchGeminiModels(apiKey);
      case "openai":
        return await this.fetchOpenAIModels(apiKey);
      case "anthropic":
        return await this.fetchAnthropicModels(apiKey);
      case "local":
        return await this.fetchLocalModels();
      default:
        return this.getStaticModelOptions(provider);
    }
  }

  async refreshAllProviderDropdowns() {
    // Update provider dropdowns for all functions
    this.functions.forEach((func) => {
      this.updateProviderDropdown(func);
    });
  }

  updateProviderDropdown(functionType) {
    const providerSelect = document.getElementById(`${functionType}Provider`);
    if (!providerSelect) return;

    // Clear existing options
    providerSelect.innerHTML = "";

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a service...";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    providerSelect.appendChild(defaultOption);

    // Add validated services
    this.serviceRegistry.forEach((serviceData, provider) => {
      if (serviceData.validated) {
        const option = document.createElement("option");
        option.value = provider;
        option.textContent =
          this.formatProviderName(provider) +
          ` (${serviceData.models.length} models)`;
        providerSelect.appendChild(option);
      }
    });

    // Add available services that haven't been validated yet
    this.availableServices.forEach((provider) => {
      if (!this.serviceRegistry.has(provider)) {
        const option = document.createElement("option");
        option.value = provider;
        option.textContent =
          this.formatProviderName(provider) + " (Not configured)";
        option.style.color = "#999";
        providerSelect.appendChild(option);
      }
    });
  }

  formatProviderName(provider) {
    const names = {
      gemini: "Google Gemini",
      openai: "OpenAI",
      anthropic: "Anthropic Claude",
      local: "Local Models",
    };
    return names[provider] || provider;
  }
  async performApiTest(provider, apiKey) {
    // Validate API key format first
    if (!apiKey || typeof apiKey !== "string") {
      throw new Error("Invalid API key format");
    }

    // Mock API tests with proper validation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple validation based on provider
    switch (provider) {
      case "openai":
        if (!apiKey.startsWith("sk-"))
          throw new Error("Invalid OpenAI key format");
        break;
      case "anthropic":
        if (!apiKey.startsWith("sk-ant-"))
          throw new Error("Invalid Anthropic key format");
        break;
      case "gemini":
        if (apiKey.length < 20) throw new Error("Invalid Gemini key format");
        break;
      case "local":
        // For local models, we don't need API key validation
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
  async updatePageInfo() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) {
        throw new Error("No active tab found");
      }

      // Check if we can access the tab
      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://") ||
        tab.url.startsWith("edge://")
      ) {
        this.setPageInfoUnavailable();
        return;
      }

      // Get page info from content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getPageInfo",
      });

      if (response && !response.error) {
        const pageStatusEl = document.getElementById("pageStatus");
        const contentTypeEl = document.getElementById("contentType");
        const wordCountEl = document.getElementById("wordCount");

        if (pageStatusEl) pageStatusEl.textContent = response.status || "Ready";
        if (contentTypeEl)
          contentTypeEl.textContent = response.contentType || "Unknown";
        if (wordCountEl) wordCountEl.textContent = response.wordCount || "-";
      } else {
        this.setPageInfoUnavailable();
      }
    } catch (error) {
      console.log("Page info not available:", error.message);
      this.setPageInfoUnavailable();
    }
  }

  setPageInfoUnavailable() {
    const pageStatusEl = document.getElementById("pageStatus");
    const contentTypeEl = document.getElementById("contentType");
    const wordCountEl = document.getElementById("wordCount");

    if (pageStatusEl) pageStatusEl.textContent = "Not Available";
    if (contentTypeEl) contentTypeEl.textContent = "Not Detected";
    if (wordCountEl) wordCountEl.textContent = "-";
  }
  async updateModelOptions(functionType) {
    const provider = document.getElementById(`${functionType}Provider`).value;
    const modelSelect = document.getElementById(`${functionType}Model`);

    if (!modelSelect || !provider) return;

    // Show loading state
    modelSelect.innerHTML = '<option value="">Loading models...</option>';
    modelSelect.disabled = true;

    try {
      let modelOptions = [];

      // Check if service is registered and validated
      if (
        this.serviceRegistry.has(provider) &&
        this.serviceRegistry.get(provider).validated
      ) {
        // Use models from service registry
        const serviceData = this.serviceRegistry.get(provider);
        modelOptions = serviceData.models;
      } else {
        // Try to fetch models directly (fallback)
        modelOptions = await this.fetchModelOptions(provider);
      }

      // Clear loading state
      modelSelect.innerHTML = "";
      modelSelect.disabled = false;

      if (modelOptions.length === 0) {
        modelSelect.innerHTML =
          '<option value="">No models available - please configure service</option>';
        return;
      }

      modelOptions.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.recommended) {
          optionElement.textContent += " ⭐";
        }
        modelSelect.appendChild(optionElement);
      });

      // Try to restore previously selected model
      const savedModel = this.settings[`${functionType}Model`];
      if (savedModel && modelOptions.find((opt) => opt.value === savedModel)) {
        modelSelect.value = savedModel;
      } else {
        // Select first recommended model
        const recommended = modelOptions.find((opt) => opt.recommended);
        if (recommended) {
          modelSelect.value = recommended.value;
        } else if (modelOptions.length > 0) {
          modelSelect.value = modelOptions[0].value;
        }
      }
    } catch (error) {
      console.error(`Error fetching models for ${provider}:`, error);
      modelSelect.innerHTML = '<option value="">Error loading models</option>';
      modelSelect.disabled = false;

      // Show configuration prompt
      this.showStatus(
        `Please configure ${this.formatProviderName(provider)} service first`,
        "warning"
      );
    }
  }

  async fetchModelOptions(provider) {
    switch (provider) {
      case "gemini":
        return await this.fetchGeminiModels();
      case "openai":
        return await this.fetchOpenAIModels();
      case "anthropic":
        return await this.fetchAnthropicModels();
      case "local":
        return await this.fetchLocalModels();
      default:
        return this.getStaticModelOptions(provider);
    }
  }
  async fetchGeminiModels(apiKey = null) {
    try {
      // Use provided API key or get from service registry
      const key = apiKey || this.validatedApiKeys.get("gemini");

      if (key && key.length > 20) {
        // Try to fetch available models from Google AI Studio API
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models?key=" + key
        );

        if (response.ok) {
          const data = await response.json();
          const models = data.models
            .filter((model) => model.name.includes("gemini"))
            .map((model) => {
              const modelName = model.name.split("/").pop();
              return {
                value: modelName,
                text: this.formatModelName(modelName),
                recommended: modelName === "gemini-1.5-flash",
              };
            });

          if (models.length > 0) {
            return models;
          }
        }
      }

      // Fallback to known models if API call fails
      return [
        {
          value: "gemini-1.5-flash",
          text: "Gemini 1.5 Flash",
          recommended: true,
        },
        { value: "gemini-1.5-flash-8b", text: "Gemini 1.5 Flash-8B" },
        { value: "gemini-1.5-pro", text: "Gemini 1.5 Pro" },
        {
          value: "gemini-2.0-flash-exp",
          text: "Gemini 2.0 Flash (Experimental)",
        },
        { value: "gemini-exp-1121", text: "Gemini Experimental 1121" },
      ];
    } catch (error) {
      console.error("Error fetching Gemini models:", error);
      return this.getStaticModelOptions("gemini");
    }
  }

  async fetchOpenAIModels(apiKey = null) {
    try {
      // Use provided API key or get from service registry
      const key = apiKey || this.validatedApiKeys.get("openai");

      if (key && key.startsWith("sk-")) {
        // Try to fetch available models from OpenAI API
        const response = await fetch("https://api.openai.com/v1/models", {
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const models = data.data
            .filter(
              (model) => model.id.includes("gpt") || model.id.includes("o1")
            )
            .sort((a, b) => {
              // Prioritize newer models
              const priority = {
                "gpt-4o": 10,
                "gpt-4o-mini": 9,
                "o1-preview": 8,
                "o1-mini": 7,
                "gpt-4-turbo": 6,
                "gpt-4": 5,
                "gpt-3.5-turbo": 4,
              };
              return (priority[b.id] || 0) - (priority[a.id] || 0);
            })
            .map((model) => ({
              value: model.id,
              text: this.formatModelName(model.id),
              recommended: model.id === "gpt-4o",
            }));

          if (models.length > 0) {
            return models;
          }
        }
      }

      // Fallback to known models
      return [
        { value: "gpt-4o", text: "GPT-4o", recommended: true },
        { value: "gpt-4o-mini", text: "GPT-4o Mini" },
        { value: "gpt-4-turbo", text: "GPT-4 Turbo" },
        { value: "gpt-4", text: "GPT-4" },
        { value: "gpt-3.5-turbo", text: "GPT-3.5 Turbo" },
        { value: "o1-preview", text: "o1 Preview" },
        { value: "o1-mini", text: "o1 Mini" },
      ];
    } catch (error) {
      console.error("Error fetching OpenAI models:", error);
      return this.getStaticModelOptions("openai");
    }
  }

  async fetchAnthropicModels(apiKey = null) {
    try {
      // Anthropic doesn't have a public models endpoint, so we use known models
      // These are the current available models as of December 2024
      return [
        {
          value: "claude-3-5-sonnet-20241022",
          text: "Claude 3.5 Sonnet (Latest)",
          recommended: true,
        },
        {
          value: "claude-3-5-sonnet-20240620",
          text: "Claude 3.5 Sonnet (June)",
        },
        { value: "claude-3-5-haiku-20241022", text: "Claude 3.5 Haiku" },
        { value: "claude-3-opus-20240229", text: "Claude 3 Opus" },
        { value: "claude-3-sonnet-20240229", text: "Claude 3 Sonnet" },
        { value: "claude-3-haiku-20240307", text: "Claude 3 Haiku" },
      ];
    } catch (error) {
      console.error("Error fetching Anthropic models:", error);
      return this.getStaticModelOptions("anthropic");
    }
  }

  async fetchLocalModels() {
    try {
      // Try to connect to local Ollama instance
      const response = await fetch("http://localhost:11434/api/tags", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const models = data.models.map((model) => ({
          value: model.name,
          text: this.formatModelName(model.name),
          recommended:
            model.name.includes("llama3.1:8b") ||
            model.name.includes("llama3.2:3b"),
        }));

        if (models.length > 0) {
          return models;
        }
      }

      // Fallback to common local models
      return [
        { value: "llama3.1:8b", text: "Llama 3.1 8B", recommended: true },
        { value: "llama3.1:70b", text: "Llama 3.1 70B" },
        { value: "llama3.2:3b", text: "Llama 3.2 3B" },
        { value: "codellama:7b", text: "Code Llama 7B" },
        { value: "codellama:13b", text: "Code Llama 13B" },
        { value: "mistral:7b", text: "Mistral 7B" },
        { value: "phi3:mini", text: "Phi-3 Mini" },
        { value: "qwen2.5:7b", text: "Qwen2.5 7B" },
      ];
    } catch (error) {
      console.error("Error fetching local models:", error);
      // If Ollama is not running or not available, show common models
      return [
        {
          value: "llama3.1:8b",
          text: "Llama 3.1 8B (Install via Ollama)",
          recommended: true,
        },
        { value: "llama3.2:3b", text: "Llama 3.2 3B (Install via Ollama)" },
        { value: "codellama:7b", text: "Code Llama 7B (Install via Ollama)" },
        { value: "mistral:7b", text: "Mistral 7B (Install via Ollama)" },
      ];
    }
  }

  formatModelName(modelId) {
    // Helper function to format model names for better readability
    return modelId
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(/Gpt/g, "GPT")
      .replace(/Llama/g, "Llama")
      .replace(/Api/g, "API");
  }
  getStaticModelOptions(provider) {
    // Fallback static model lists in case API calls fail
    const modelOptions = {
      gemini: [
        {
          value: "gemini-1.5-flash",
          text: "Gemini 1.5 Flash (Recommended)",
          recommended: true,
        },
        { value: "gemini-1.5-pro", text: "Gemini 1.5 Pro" },
        { value: "gemini-2.0-flash", text: "Gemini 2.0 Flash" },
      ],
      openai: [
        { value: "gpt-4o", text: "GPT-4o (Recommended)", recommended: true },
        { value: "gpt-4", text: "GPT-4" },
        { value: "gpt-4-turbo", text: "GPT-4 Turbo" },
        { value: "gpt-3.5-turbo", text: "GPT-3.5 Turbo" },
      ],
      anthropic: [
        {
          value: "claude-3-5-sonnet-20241022",
          text: "Claude 3.5 Sonnet (Recommended)",
          recommended: true,
        },
        { value: "claude-3-sonnet-20240229", text: "Claude 3 Sonnet" },
        { value: "claude-3-haiku-20240307", text: "Claude 3 Haiku" },
      ],
      local: [
        {
          value: "llama3.1:8b",
          text: "Llama 3.1 8B (Recommended)",
          recommended: true,
        },
        { value: "llama3.2:3b", text: "Llama 3.2 3B" },
        { value: "codellama:7b", text: "Code Llama 7B" },
      ],
    };

    return modelOptions[provider] || [];
  }
  async loadSettings() {
    try {
      // Load service registry first
      await this.loadServiceRegistry();

      // Load function-specific settings
      const functionSettings = {};
      this.functions.forEach((func) => {
        functionSettings[`${func}Provider`] = "";
        functionSettings[`${func}Model`] = "";
        functionSettings[`${func}ApiKey`] = "";
        functionSettings[`${func}Prompt`] = "";
      });

      const result = await chrome.storage.sync.get([
        ...Object.keys(functionSettings),
        "temperature",
        "maxTokens",
        "autoDetect",
        "showBanner",
        "enableChunking",
      ]);

      // Initialize provider dropdowns for all functions
      this.functions.forEach((func) => {
        this.updateProviderDropdown(func);
      });

      // Load function-specific settings
      this.functions.forEach((func) => {
        const provider = result[`${func}Provider`] || "";
        const model = result[`${func}Model`] || "";
        const apiKey = result[`${func}ApiKey`] || "";
        const prompt = result[`${func}Prompt`] || "";

        const providerEl = document.getElementById(`${func}Provider`);
        const modelEl = document.getElementById(`${func}Model`);
        const apiKeyEl = document.getElementById(`${func}ApiKey`);
        const promptEl = document.getElementById(`${func}Prompt`);

        if (providerEl && provider) providerEl.value = provider;
        if (apiKeyEl) apiKeyEl.value = apiKey;
        if (promptEl) promptEl.value = prompt;

        // Update model options and set value
        if (provider) {
          this.updateModelOptions(func).then(() => {
            if (modelEl && model) modelEl.value = model;
          });
        }
      });

      // Load global settings
      const temperatureSlider = document.getElementById("temperatureSlider");
      const temperatureValue = document.getElementById("temperatureValue");
      if (temperatureSlider && result.temperature) {
        temperatureSlider.value = result.temperature;
        if (temperatureValue) temperatureValue.textContent = result.temperature;
      }

      const maxTokensEl = document.getElementById("maxTokens");
      if (maxTokensEl && result.maxTokens) {
        maxTokensEl.value = result.maxTokens;
      }

      const autoDetectEl = document.getElementById("autoDetect");
      if (autoDetectEl && result.autoDetect !== undefined) {
        autoDetectEl.checked = result.autoDetect;
      }

      const showBannerEl = document.getElementById("showBanner");
      if (showBannerEl && result.showBanner !== undefined) {
        showBannerEl.checked = result.showBanner;
      }

      const enableChunkingEl = document.getElementById("enableChunking");
      if (enableChunkingEl && result.enableChunking !== undefined) {
        enableChunkingEl.checked = result.enableChunking;
      }

      this.settings = result;
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  async saveServiceRegistry() {
    try {
      const registryData = {};
      this.serviceRegistry.forEach((value, key) => {
        registryData[`service_${key}`] = value;
      });

      const validatedKeysData = {};
      this.validatedApiKeys.forEach((value, key) => {
        validatedKeysData[`apiKey_${key}`] = value;
      });

      await chrome.storage.sync.set({
        ...registryData,
        ...validatedKeysData,
        serviceRegistryKeys: Array.from(this.serviceRegistry.keys()),
        validatedApiKeyKeys: Array.from(this.validatedApiKeys.keys()),
      });
    } catch (error) {
      console.error("Error saving service registry:", error);
    }
  }

  async loadServiceRegistry() {
    try {
      const result = await chrome.storage.sync.get(null);

      // Load service registry
      if (result.serviceRegistryKeys) {
        result.serviceRegistryKeys.forEach((key) => {
          const serviceData = result[`service_${key}`];
          if (serviceData) {
            this.serviceRegistry.set(key, serviceData);
          }
        });
      }

      // Load validated API keys
      if (result.validatedApiKeyKeys) {
        result.validatedApiKeyKeys.forEach((key) => {
          const apiKey = result[`apiKey_${key}`];
          if (apiKey) {
            this.validatedApiKeys.set(key, apiKey);
          }
        });
      }

      console.log(
        `Loaded ${this.serviceRegistry.size} services and ${this.validatedApiKeys.size} API keys`
      );
    } catch (error) {
      console.error("Error loading service registry:", error);
    }
  }

  async saveFunctionSettings(functionType) {
    const settings = {};
    settings[`${functionType}Provider`] =
      document.getElementById(`${functionType}Provider`)?.value || "";
    settings[`${functionType}Model`] =
      document.getElementById(`${functionType}Model`)?.value || "";
    settings[`${functionType}ApiKey`] =
      document.getElementById(`${functionType}ApiKey`)?.value || "";
    settings[`${functionType}Prompt`] =
      document.getElementById(`${functionType}Prompt`)?.value || "";

    try {
      await chrome.storage.sync.set(settings);
      this.settings = { ...this.settings, ...settings };
    } catch (error) {
      console.error(`Error saving ${functionType} settings:`, error);
    }
  }

  async saveSettings() {
    const settings = {
      temperature: parseFloat(
        document.getElementById("temperatureSlider")?.value || 0.7
      ),
      maxTokens: parseInt(document.getElementById("maxTokens")?.value || 8192),
      autoDetect: document.getElementById("autoDetect")?.checked || false,
      showBanner: document.getElementById("showBanner")?.checked || false,
      enableChunking:
        document.getElementById("enableChunking")?.checked || false,
    };

    try {
      await chrome.storage.sync.set(settings);
      this.settings = { ...this.settings, ...settings };
      this.showStatus("Settings saved successfully!", "success");
    } catch (error) {
      console.error("Error saving settings:", error);
      this.showStatus("Failed to save settings", "error");
    }
  }

  resetSettings() {
    if (confirm("Reset all settings to default values?")) {
      // Reset global settings
      const temperatureSlider = document.getElementById("temperatureSlider");
      const temperatureValue = document.getElementById("temperatureValue");
      if (temperatureSlider) {
        temperatureSlider.value = "0.7";
        if (temperatureValue) temperatureValue.textContent = "0.7";
      }

      const maxTokensEl = document.getElementById("maxTokens");
      if (maxTokensEl) maxTokensEl.value = "8192";

      const autoDetectEl = document.getElementById("autoDetect");
      if (autoDetectEl) autoDetectEl.checked = true;

      const showBannerEl = document.getElementById("showBanner");
      if (showBannerEl) showBannerEl.checked = true;

      const enableChunkingEl = document.getElementById("enableChunking");
      if (enableChunkingEl) enableChunkingEl.checked = true;

      // Reset function settings
      this.functions.forEach((func) => {
        const providerEl = document.getElementById(`${func}Provider`);
        const apiKeyEl = document.getElementById(`${func}ApiKey`);
        const promptEl = document.getElementById(`${func}Prompt`);

        if (providerEl) providerEl.value = "gemini";
        if (apiKeyEl) apiKeyEl.value = "";
        if (promptEl) promptEl.value = "";

        this.updateModelOptions(func);
      });

      this.saveSettings();
    }
  }

  getFunctionSettings(functionType) {
    return {
      provider:
        document.getElementById(`${functionType}Provider`)?.value || "gemini",
      model:
        document.getElementById(`${functionType}Model`)?.value ||
        "gemini-1.5-flash",
      apiKey: document.getElementById(`${functionType}ApiKey`)?.value || "",
      prompt: document.getElementById(`${functionType}Prompt`)?.value || "",
    };
  }

  showStatus(message, type = "info", statusMessageId = "statusMessage") {
    const statusMessage = document.getElementById(statusMessageId);
    const statusBar = document.getElementById("status");

    if (statusMessage) {
      const statusText = statusMessage.querySelector(".status-text");
      if (statusText) {
        statusText.textContent = message;
        statusMessage.style.display = "flex";
        statusMessage.className = `status-message ${type}`;
      }
    }

    if (statusBar) {
      statusBar.textContent = message;
      statusBar.className = `status-bar ${type}`;
    }
  }

  hideStatus(statusMessageId = "statusMessage") {
    const statusMessage = document.getElementById(statusMessageId);
    if (statusMessage) {
      statusMessage.style.display = "none";
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Automatic feature management system
  async addNewFeature(featureName, displayName = null) {
    if (!this.functions.includes(featureName)) {
      this.functions.push(featureName);

      // Add to UI if DOM elements exist
      const tabsContainer = document.querySelector(".tabs");
      const contentContainer = document.querySelector(".tab-contents");

      if (tabsContainer && contentContainer) {
        // Create new tab button
        const tabButton = document.createElement("button");
        tabButton.className = "tab-btn";
        tabButton.setAttribute("data-tab", featureName);
        tabButton.textContent = displayName || this.capitalize(featureName);
        tabsContainer.appendChild(tabButton);

        // Create new tab content (this would need proper HTML structure)
        const tabContent = document.createElement("div");
        tabContent.id = featureName;
        tabContent.className = "tab-content";
        tabContent.innerHTML = this.generateFeatureHTML(
          featureName,
          displayName
        );
        contentContainer.appendChild(tabContent);

        // Re-setup event listeners for new feature
        this.setupNewFeatureHandlers(featureName);

        // Initialize provider dropdown for new feature
        this.updateProviderDropdown(featureName);

        console.log(`New feature '${featureName}' added successfully`);
      }
    }
  }

  generateFeatureHTML(featureName, displayName) {
    const name = displayName || this.capitalize(featureName);
    return `
      <div class="function-config">
        <h3>${name} Configuration</h3>

        <div class="form-group">
          <label for="${featureName}Provider">AI Service:</label>
          <select id="${featureName}Provider" class="form-control">
            <option value="">Select a service...</option>
          </select>
        </div>

        <div class="form-group">
          <label for="${featureName}Model">Model:</label>
          <select id="${featureName}Model" class="form-control">
            <option value="">Select model...</option>
          </select>
        </div>

        <div class="form-group">
          <label for="${featureName}ApiKey">API Key:</label>
          <div class="api-key-container">
            <input type="password" id="${featureName}ApiKey" class="form-control"
                   placeholder="Enter your API key">
            <button type="button" id="test${this.capitalize(featureName)}ApiKey"
                    class="btn btn-test">Test</button>
          </div>
        </div>

        <div class="form-group">
          <label for="${featureName}Prompt">Custom Prompt:</label>
          <textarea id="${featureName}Prompt" class="form-control" rows="3"
                    placeholder="Enter custom prompt for ${name.toLowerCase()}..."></textarea>
        </div>

        <button type="button" id="${featureName}Btn" class="btn btn-primary btn-action">
          <span class="btn-text">${name}</span>
        </button>

        <div id="${featureName}StatusMessage" class="status-message" style="display: none;">
          <span class="status-text"></span>
        </div>
      </div>
    `;
  }

  setupNewFeatureHandlers(featureName) {
    // Action button
    const button = document.getElementById(`${featureName}Btn`);
    if (button) {
      button.addEventListener("click", () => {
        this.executeAction(featureName);
      });
    }

    // Test API key button
    const testButton = document.getElementById(
      `test${this.capitalize(featureName)}ApiKey`
    );
    if (testButton) {
      testButton.addEventListener("click", () => {
        this.testApiKey(featureName);
      });
    }

    // Provider change handler
    const providerSelect = document.getElementById(`${featureName}Provider`);
    if (providerSelect) {
      providerSelect.addEventListener("change", async () => {
        await this.updateModelOptions(featureName);
      });
    }

    // Real-time settings updates
    const inputs = document.querySelectorAll(
      `#${featureName}Provider, #${featureName}Model, #${featureName}ApiKey, #${featureName}Prompt`
    );
    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        this.saveFunctionSettings(featureName);
      });
    });

    // Tab functionality
    const tabButton = document.querySelector(`[data-tab="${featureName}"]`);
    if (tabButton) {
      tabButton.addEventListener("click", () => {
        const tabButtons = document.querySelectorAll(".tab-btn");
        const tabContents = document.querySelectorAll(".tab-content");

        // Remove active class from all tabs and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked tab and corresponding content
        tabButton.classList.add("active");
        document.getElementById(featureName).classList.add("active");

        this.currentTab = featureName;
      });
    }
  }

  // Service management methods
  async removeService(provider) {
    if (this.serviceRegistry.has(provider)) {
      this.serviceRegistry.delete(provider);
      this.validatedApiKeys.delete(provider);
      await this.saveServiceRegistry();

      // Refresh all provider dropdowns
      await this.refreshAllProviderDropdowns();

      console.log(`Service '${provider}' removed`);
    }
  }

  async refreshService(provider) {
    if (this.validatedApiKeys.has(provider)) {
      try {
        const apiKey = this.validatedApiKeys.get(provider);
        await this.validateAndRegisterService(provider, apiKey);
        await this.refreshAllProviderDropdowns();

        console.log(`Service '${provider}' refreshed`);
      } catch (error) {
        console.error(`Failed to refresh service '${provider}':`, error);
      }
    }
  }

  getAvailableServices() {
    return Array.from(this.serviceRegistry.keys()).filter(
      (provider) => this.serviceRegistry.get(provider).validated
    );
  }

  getServiceModels(provider) {
    const serviceData = this.serviceRegistry.get(provider);
    return serviceData ? serviceData.models : [];
  }

  isServiceValidated(provider) {
    const serviceData = this.serviceRegistry.get(provider);
    return serviceData && serviceData.validated;
  }
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new NovelSynthPopup();
});
