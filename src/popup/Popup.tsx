import React, { useState, useEffect } from "react";
import type { UserSettings, AIProvider, SiteHandler } from "../types";

interface PopupState {
  settings: UserSettings | null;
  providers: AIProvider[];
  handlers: SiteHandler[];
  currentTab: "overview" | "providers" | "handlers" | "settings";
  loading: boolean;
  error: string | null;
}

export const Popup: React.FC = () => {
  const [state, setState] = useState<PopupState>({
    settings: null,
    providers: [],
    handlers: [],
    currentTab: "overview",
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await sendMessage({ type: "GET_SETTINGS" });

      if (response.success) {
        setState((prev) => ({
          ...prev,
          settings: response.settings,
          providers: response.providers,
          handlers: response.handlers,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: "Failed to load settings",
          loading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      }));
    }
  };

  const sendMessage = (message: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const response = await sendMessage({
        type: "UPDATE_SETTINGS",
        payload: updates,
      });

      if (response.success) {
        setState((prev) => ({
          ...prev,
          settings: prev.settings ? { ...prev.settings, ...updates } : null,
        }));
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const setActiveTab = (tab: PopupState["currentTab"]) => {
    setState((prev) => ({ ...prev, currentTab: tab }));
  };

  const renderHeader = () => (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">📚</div>
        <h1>NovelSynth</h1>
      </div>
      <div className="nav-tabs">
        <button
          className={`tab ${state.currentTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab ${state.currentTab === "providers" ? "active" : ""}`}
          onClick={() => setActiveTab("providers")}
        >
          AI
        </button>
        <button
          className={`tab ${state.currentTab === "handlers" ? "active" : ""}`}
          onClick={() => setActiveTab("handlers")}
        >
          Sites
        </button>
        <button
          className={`tab ${state.currentTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="tab-content">
      <div className="status-card">
        <h3>Status</h3>
        <div className="status-item">
          <span>AI Provider:</span>
          <span className="status-value">
            {state.providers.find(
              (p) => p.id === state.settings?.selectedProvider
            )?.name || "None"}
          </span>
        </div>
        <div className="status-item">
          <span>Enabled Handlers:</span>
          <span className="status-value">
            {state.settings?.enabledHandlers.length || 0}
          </span>
        </div>
        <div className="status-item">
          <span>Features:</span>
          <span className="status-value">
            {state.settings?.enabledFeatures.length || 0}
          </span>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <button
          className="action-btn"
          onClick={() => setActiveTab("providers")}
        >
          🤖 Configure AI Provider
        </button>
        <button className="action-btn" onClick={() => setActiveTab("handlers")}>
          🌐 Manage Site Handlers
        </button>
      </div>
    </div>
  );

  const renderProviders = () => (
    <div className="tab-content">
      <h3>AI Providers</h3>
      <div className="provider-list">
        {state.providers.map((provider) => (
          <div key={provider.id} className="provider-item">
            <div className="provider-info">
              <div className="provider-name">{provider.name}</div>
              <div className="provider-features">
                {provider.features.join(", ")}
              </div>
            </div>
            <div className="provider-actions">
              <button
                className={`select-btn ${
                  state.settings?.selectedProvider === provider.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  updateSettings({ selectedProvider: provider.id })
                }
              >
                {state.settings?.selectedProvider === provider.id
                  ? "Selected"
                  : "Select"}
              </button>
              {provider.requiresAuth && (
                <input
                  type="password"
                  placeholder="API Key"
                  className="api-key-input"
                  value={state.settings?.apiKeys[provider.id] || ""}
                  onChange={(e) => {
                    const newApiKeys = { ...state.settings?.apiKeys };
                    newApiKeys[provider.id] = e.target.value;
                    updateSettings({ apiKeys: newApiKeys });
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHandlers = () => (
    <div className="tab-content">
      <h3>Site Handlers</h3>
      <div className="handler-list">
        {state.handlers.map((handler) => (
          <div key={handler.name} className="handler-item">
            <div className="handler-info">
              <div className="handler-name">{handler.name}</div>
              <div className="handler-domains">
                {handler.domains.join(", ")}
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={
                  state.settings?.enabledHandlers.includes(handler.name) ||
                  false
                }
                onChange={(e) => {
                  const currentHandlers = state.settings?.enabledHandlers || [];
                  const newHandlers = e.target.checked
                    ? [...currentHandlers, handler.name]
                    : currentHandlers.filter((h) => h !== handler.name);
                  updateSettings({ enabledHandlers: newHandlers });
                }}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="tab-content">
      <h3>Settings</h3>

      <div className="setting-group">
        <h4>Features</h4>
        {["summarize", "analyze", "suggestions"].map((feature) => (
          <label key={feature} className="setting-item">
            <input
              type="checkbox"
              checked={
                state.settings?.enabledFeatures.includes(feature) || false
              }
              onChange={(e) => {
                const currentFeatures = state.settings?.enabledFeatures || [];
                const newFeatures = e.target.checked
                  ? [...currentFeatures, feature]
                  : currentFeatures.filter((f) => f !== feature);
                updateSettings({ enabledFeatures: newFeatures });
              }}
            />
            <span>{feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
          </label>
        ))}
      </div>

      <div className="setting-group">
        <h4>Theme</h4>
        <select
          value={state.settings?.theme || "auto"}
          onChange={(e) => updateSettings({ theme: e.target.value as any })}
          className="theme-select"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      <div className="setting-group">
        <button
          className="danger-btn"
          onClick={() => {
            if (confirm("Are you sure you want to reset all settings?")) {
              // Reset to defaults
              updateSettings({
                selectedProvider: "gemini",
                apiKeys: {},
                enabledFeatures: ["summarize", "analyze", "suggestions"],
                enabledHandlers: state.handlers.map((h) => h.name),
                theme: "auto",
              });
            }
          }}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  if (state.loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading NovelSynth...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{state.error}</p>
        <button onClick={loadSettings}>Retry</button>
      </div>
    );
  }

  return (
    <div className="popup-container">
      {renderHeader()}
      <div className="content">
        {state.currentTab === "overview" && renderOverview()}
        {state.currentTab === "providers" && renderProviders()}
        {state.currentTab === "handlers" && renderHandlers()}
        {state.currentTab === "settings" && renderSettings()}
      </div>
    </div>
  );
};
