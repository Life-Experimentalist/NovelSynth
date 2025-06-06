// Popup script for NovelSynth extension
import StorageManager from "../utils/StorageManager";
import "./popup.css";

// Log initialization for debugging
console.log("NovelSynth popup initializing...");

// DOM elements
const elements = {};

// Default settings
const DEFAULT_SETTINGS = {
  apiKey: "",
  model: "gpt-4o",
  temperature: 0.7,
  topP: 0.95,
  maxOutputTokens: 8192,
  chunkingEnabled: true,
  chunkSize: 12000,
  useEmoji: false,
  showBanner: true,
  theme: "auto",
};

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  console.log("NovelSynth popup DOM loaded");

  try {
    // Cache DOM elements
    cacheElements();

    // Load settings
    const settings = await loadSettings();

    // Initialize UI
    initializeUI(settings);

    // Set up event listeners
    setupEventListeners();

    console.log("NovelSynth popup initialized successfully");
  } catch (error) {
    console.error("Error initializing popup:", error);
    showStatus(
      "Error initializing popup. Please check console for details.",
      "error"
    );
  }
});

// Cache DOM elements for faster access
function cacheElements() {
  // Tab navigation
  elements.tabButtons = document.querySelectorAll(".tab-btn");
  elements.tabContents = document.querySelectorAll(".tab-content");

  // Settings tab elements
  elements.apiKeyInput = document.getElementById("apiKey");
  elements.modelSelect = document.getElementById("modelSelect");
  elements.temperatureSlider = document.getElementById("temperatureSlider");
  elements.temperatureValue = document.getElementById("temperatureValue");
  elements.saveSettingsBtn = document.getElementById("saveSettings");
  elements.enhancePageBtn = document.getElementById("enhancePageBtn");

  // Theme toggle
  elements.themeToggle = document.getElementById("theme-toggle");

  // Status area
  elements.statusArea = document.getElementById("status");

  // Resize handle
  elements.resizeHandle = document.getElementById("resize-handle");
  elements.sizeIndicator = document.getElementById("sizeIndicator");
}

// Load settings from storage
async function loadSettings() {
  try {
    console.log("Loading settings from storage");
    const storedSettings = await StorageManager.getSettings();
    console.log("Settings loaded:", storedSettings);
    return { ...DEFAULT_SETTINGS, ...storedSettings };
  } catch (error) {
    console.error("Error loading settings:", error);
    showStatus("Error loading settings. Using defaults.", "error");
    return DEFAULT_SETTINGS;
  }
}

// Initialize UI based on loaded settings
function initializeUI(settings) {
  console.log("Initializing UI with settings:", settings);

  // Apply theme
  applyTheme(settings.theme);

  // Set form values
  if (elements.apiKeyInput) {
    elements.apiKeyInput.value = settings.apiKey || "";
  }

  if (elements.modelSelect) {
    elements.modelSelect.value = settings.model || "gpt-4o";
  }

  if (elements.temperatureSlider) {
    elements.temperatureSlider.value = settings.temperature || 0.7;
    updateTemperatureDisplay(settings.temperature || 0.7);
  }

  // Show initial tab
  const initialTab = document.querySelector(".tab-btn.active");
  if (initialTab) {
    const tabName = initialTab.getAttribute("data-tab");
    switchTab(tabName);
  }
}

// Apply theme (light, dark, or auto)
function applyTheme(theme) {
  const root = document.documentElement;
  const container = document.getElementById("app-container");

  if (!container) return;

  // Remove existing theme classes
  container.classList.remove("dark-theme", "light-theme");

  if (theme === "auto") {
    // Use system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    container.classList.add(prefersDark ? "dark-theme" : "light-theme");
  } else {
    // Use specified theme
    container.classList.add(`${theme}-theme`);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Tab switching
  if (elements.tabButtons) {
    elements.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabName = button.getAttribute("data-tab");
        console.log("Tab clicked:", tabName);
        switchTab(tabName);
      });
    });
  }

  // Temperature slider
  if (elements.temperatureSlider) {
    elements.temperatureSlider.addEventListener("input", (e) => {
      updateTemperatureDisplay(e.target.value);
    });
  }

  // Theme toggle
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener("click", toggleTheme);
  }

  // Save settings button
  if (elements.saveSettingsBtn) {
    elements.saveSettingsBtn.addEventListener("click", saveSettings);
  }

  // Enhance page button
  if (elements.enhancePageBtn) {
    elements.enhancePageBtn.addEventListener("click", enhanceCurrentPage);
  }

  // Resize handle
  if (elements.resizeHandle) {
    elements.resizeHandle.addEventListener("mousedown", initResize);
  }
}

// Switch between tabs
function switchTab(tabName) {
  if (!elements.tabButtons || !elements.tabContents) {
    console.error("Tab elements not found");
    return;
  }

  console.log("Switching to tab:", tabName);

  elements.tabButtons.forEach((btn) => {
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  elements.tabContents.forEach((content) => {
    if (content.id === tabName) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });
}

// Update temperature display
function updateTemperatureDisplay(value) {
  if (elements.temperatureValue) {
    elements.temperatureValue.textContent = value;
  }
}

// Toggle between light and dark theme
function toggleTheme() {
  const container = document.getElementById("app-container");

  if (container.classList.contains("dark-theme")) {
    container.classList.remove("dark-theme");
    container.classList.add("light-theme");
    saveThemePreference("light");
  } else {
    container.classList.remove("light-theme");
    container.classList.add("dark-theme");
    saveThemePreference("dark");
  }
}

// Save theme preference
async function saveThemePreference(theme) {
  try {
    const settings = await StorageManager.getSettings();
    settings.theme = theme;
    await StorageManager.saveSettings(settings);
  } catch (error) {
    console.error("Error saving theme preference:", error);
  }
}

// Save settings
async function saveSettings() {
  try {
    const settings = await StorageManager.getSettings();

    // Update settings with form values
    if (elements.apiKeyInput) {
      settings.apiKey = elements.apiKeyInput.value;
    }

    if (elements.modelSelect) {
      settings.model = elements.modelSelect.value;
    }

    if (elements.temperatureSlider) {
      settings.temperature = parseFloat(elements.temperatureSlider.value);
    }

    console.log("Saving settings:", settings);
    await StorageManager.saveSettings(settings);

    showStatus("Settings saved successfully", "success");
  } catch (error) {
    console.error("Error saving settings:", error);
    showStatus("Error saving settings", "error");
  }
}

// Enhance current page
function enhanceCurrentPage() {
  showStatus("Processing current page...", "info");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      chrome.runtime.sendMessage(
        {
          action: "enhanceContent",
          tabId: tabs[0].id,
        },
        (response) => {
          if (response && response.success) {
            showStatus("Page enhancement started", "success");
          } else {
            showStatus(response?.error || "Failed to enhance page", "error");
          }
        }
      );
    } else {
      showStatus("No active tab found", "error");
    }
  });
}

// Initialize resize functionality
function initResize(e) {
  e.preventDefault();

  const popup = document.body;
  const startWidth = popup.offsetWidth;
  const startHeight = popup.offsetHeight;
  const startX = e.clientX;
  const startY = e.clientY;

  if (elements.sizeIndicator) {
    elements.sizeIndicator.textContent = `${startWidth}×${startHeight}`;
    elements.sizeIndicator.classList.add("visible");
  }

  function resize(e) {
    const width = startWidth + (e.clientX - startX);
    const height = startHeight + (e.clientY - startY);

    // Apply minimum and maximum constraints
    const constrainedWidth = Math.max(300, Math.min(800, width));
    const constrainedHeight = Math.max(300, Math.min(600, height));

    popup.style.width = `${constrainedWidth}px`;
    popup.style.height = `${constrainedHeight}px`;

    if (elements.sizeIndicator) {
      elements.sizeIndicator.textContent = `${constrainedWidth}×${constrainedHeight}`;
    }
  }

  function stopResize() {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);

    if (elements.sizeIndicator) {
      elements.sizeIndicator.classList.remove("visible");
    }

    // Save size preference
    const newWidth = popup.offsetWidth;
    const newHeight = popup.offsetHeight;

    chrome.storage.local.set({
      popupSize: { width: newWidth, height: newHeight },
    });
  }

  window.addEventListener("mousemove", resize);
  window.addEventListener("mouseup", stopResize);
}

// Show status message
function showStatus(message, type = "info") {
  if (!elements.statusArea) {
    console.error("Status area element not found");
    return;
  }

  console.log(`Status (${type}): ${message}`);

  elements.statusArea.textContent = message;
  elements.statusArea.className = "status-area visible";

  if (type) {
    elements.statusArea.classList.add(type);
  }

  setTimeout(() => {
    elements.statusArea.classList.remove("visible");
  }, 3000);
}
