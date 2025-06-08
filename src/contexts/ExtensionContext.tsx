import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import {
  ExtensionConfig,
  FeatureConfig,
  AIProviderConfig,
  WebsiteHandlerConfig,
  UIState,
  FeatureExecution,
  FeatureResult,
} from "../types/extension";
import { AIManager } from "../services/AIManager";

interface ExtensionState {
  config: ExtensionConfig | null;
  ui: UIState;
  features: FeatureConfig[];
  aiProviders: AIProviderConfig[];
  websiteHandlers: WebsiteHandlerConfig[];
  aiManager: AIManager;
  isLoading: boolean;
  error: string | null;
}

type ExtensionAction =
  | { type: "LOAD_CONFIG"; payload: ExtensionConfig }
  | { type: "UPDATE_FEATURE"; payload: FeatureConfig }
  | { type: "UPDATE_AI_PROVIDER"; payload: AIProviderConfig }
  | { type: "UPDATE_UI_STATE"; payload: Partial<UIState> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "REGISTER_FEATURE"; payload: FeatureConfig }
  | { type: "REGISTER_AI_PROVIDER"; payload: AIProviderConfig }
  | { type: "REGISTER_WEBSITE_HANDLER"; payload: WebsiteHandlerConfig };

const initialState: ExtensionState = {
  config: null,
  ui: {
    isPopupOpen: false,
    isFloatingPanelOpen: false,
    theme: "auto",
  },
  features: [],
  aiProviders: [],
  websiteHandlers: [],
  aiManager: new AIManager(),
  isLoading: false,
  error: null,
};

function extensionReducer(
  state: ExtensionState,
  action: ExtensionAction
): ExtensionState {
  switch (action.type) {
    case "LOAD_CONFIG":
      const loadedState = {
        ...state,
        config: action.payload,
        features: action.payload.features,
        aiProviders: action.payload.aiProviders,
        websiteHandlers: action.payload.websiteHandlers,
        isLoading: false,
      };
      // Initialize AI services after loading providers
      loadedState.aiManager.initializeServices(loadedState.aiProviders);
      return loadedState;

    case "UPDATE_FEATURE":
      return {
        ...state,
        features: state.features.map((feature) =>
          feature.id === action.payload.id ? action.payload : feature
        ),
      };
    case "UPDATE_AI_PROVIDER":
      const updatedState = {
        ...state,
        aiProviders: state.aiProviders.map((provider) =>
          provider.id === action.payload.id ? action.payload : provider
        ),
      };
      // Reinitialize AI services when providers change
      updatedState.aiManager.initializeServices(updatedState.aiProviders);
      return updatedState;

    case "UPDATE_UI_STATE":
      return {
        ...state,
        ui: { ...state.ui, ...action.payload },
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "REGISTER_FEATURE":
      return {
        ...state,
        features: [
          ...state.features.filter((f) => f.id !== action.payload.id),
          action.payload,
        ].sort((a, b) => a.priority - b.priority),
      };

    case "REGISTER_AI_PROVIDER":
      return {
        ...state,
        aiProviders: [
          ...state.aiProviders.filter((p) => p.id !== action.payload.id),
          action.payload,
        ],
      };

    case "REGISTER_WEBSITE_HANDLER":
      return {
        ...state,
        websiteHandlers: [
          ...state.websiteHandlers.filter((h) => h.id !== action.payload.id),
          action.payload,
        ].sort((a, b) => b.priority - a.priority),
      };

    default:
      return state;
  }
}

interface ExtensionContextType {
  state: ExtensionState;

  // Configuration actions
  loadConfig: () => Promise<void>;
  updateFeature: (feature: FeatureConfig) => void;
  updateAIProvider: (provider: AIProviderConfig) => void;

  // UI actions
  updateUIState: (updates: Partial<UIState>) => void;
  togglePopup: () => void;
  toggleFloatingPanel: () => void;

  // Feature execution
  executeFeature: (execution: FeatureExecution) => Promise<FeatureResult>;

  // AI service management
  testAIService: (providerId: string) => Promise<boolean>;
  getAvailableModels: (providerId: string) => Promise<string[]>;

  // Registration (for modular architecture)
  registerFeature: (feature: FeatureConfig) => void;
  registerAIProvider: (provider: AIProviderConfig) => void;
  registerWebsiteHandler: (handler: WebsiteHandlerConfig) => void;

  // Utilities
  getEnabledFeatures: () => FeatureConfig[];
  getTopPriorityFeatures: (count: number) => FeatureConfig[];
  getActiveAIProvider: () => AIProviderConfig | null;
}

const ExtensionContext = createContext<ExtensionContextType | null>(null);

export const useExtension = () => {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error("useExtension must be used within an ExtensionProvider");
  }
  return context;
};

interface ExtensionProviderProps {
  children: React.ReactNode;
}

export const ExtensionProvider: React.FC<ExtensionProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(extensionReducer, initialState);

  // Load configuration from storage
  const loadConfig = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // This will be replaced with actual storage API calls
      const config = await loadConfigFromStorage();
      dispatch({ type: "LOAD_CONFIG", payload: config });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to load config",
      });
    }
  }, []);

  // Update feature configuration
  const updateFeature = useCallback((feature: FeatureConfig) => {
    dispatch({ type: "UPDATE_FEATURE", payload: feature });
    // Save to storage
    saveFeatureToStorage(feature);
  }, []);

  // Update AI provider configuration
  const updateAIProvider = useCallback((provider: AIProviderConfig) => {
    dispatch({ type: "UPDATE_AI_PROVIDER", payload: provider });
    // Save to storage
    saveAIProviderToStorage(provider);
  }, []);

  // UI state management
  const updateUIState = useCallback((updates: Partial<UIState>) => {
    dispatch({ type: "UPDATE_UI_STATE", payload: updates });
  }, []);

  const togglePopup = useCallback(() => {
    dispatch({
      type: "UPDATE_UI_STATE",
      payload: { isPopupOpen: !state.ui.isPopupOpen },
    });
  }, [state.ui.isPopupOpen]);

  const toggleFloatingPanel = useCallback(() => {
    dispatch({
      type: "UPDATE_UI_STATE",
      payload: { isFloatingPanelOpen: !state.ui.isFloatingPanelOpen },
    });
  }, [state.ui.isFloatingPanelOpen]);
  // Feature execution
  const executeFeature = useCallback(
    async (execution: FeatureExecution): Promise<FeatureResult> => {
      dispatch({
        type: "UPDATE_UI_STATE",
        payload: { processingFeature: execution.featureId },
      });

      try {
        // Find the feature and AI provider
        const feature = state.features.find(
          (f) => f.id === execution.featureId
        );
        const aiProvider = state.aiProviders.find(
          (p) => p.id === execution.aiProvider
        );

        if (!feature) {
          throw new Error(`Feature ${execution.featureId} not found`);
        }

        if (!aiProvider) {
          throw new Error(`AI provider ${execution.aiProvider} not found`);
        }

        // Execute with AI manager
        const result = await state.aiManager.executeFeature(
          execution,
          feature,
          aiProvider
        );

        dispatch({
          type: "UPDATE_UI_STATE",
          payload: { processingFeature: undefined },
        });
        return result;
      } catch (error) {
        dispatch({
          type: "UPDATE_UI_STATE",
          payload: { processingFeature: undefined },
        });

        return {
          featureId: execution.featureId,
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          timestamp: Date.now(),
        };
      }
    },
    [state.features, state.aiProviders, state.aiManager]
  );

  // AI service management
  const testAIService = useCallback(
    async (providerId: string): Promise<boolean> => {
      return await state.aiManager.testService(providerId);
    },
    [state.aiManager]
  );

  const getAvailableModels = useCallback(
    async (providerId: string): Promise<string[]> => {
      return await state.aiManager.getAvailableModels(providerId);
    },
    [state.aiManager]
  );

  // Registration methods for modular architecture
  const registerFeature = useCallback((feature: FeatureConfig) => {
    dispatch({ type: "REGISTER_FEATURE", payload: feature });
  }, []);

  const registerAIProvider = useCallback((provider: AIProviderConfig) => {
    dispatch({ type: "REGISTER_AI_PROVIDER", payload: provider });
  }, []);

  const registerWebsiteHandler = useCallback(
    (handler: WebsiteHandlerConfig) => {
      dispatch({ type: "REGISTER_WEBSITE_HANDLER", payload: handler });
    },
    []
  );

  // Utility methods
  const getEnabledFeatures = useCallback(() => {
    return state.features.filter((feature) => feature.enabled);
  }, [state.features]);

  const getTopPriorityFeatures = useCallback(
    (count: number) => {
      return getEnabledFeatures().slice(0, count);
    },
    [getEnabledFeatures]
  );

  const getActiveAIProvider = useCallback(() => {
    return (
      state.aiProviders.find(
        (provider) => provider.enabled && provider.apiKey
      ) || null
    );
  }, [state.aiProviders]);

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);
  const contextValue: ExtensionContextType = {
    state,
    loadConfig,
    updateFeature,
    updateAIProvider,
    updateUIState,
    togglePopup,
    toggleFloatingPanel,
    executeFeature,
    testAIService,
    getAvailableModels,
    registerFeature,
    registerAIProvider,
    registerWebsiteHandler,
    getEnabledFeatures,
    getTopPriorityFeatures,
    getActiveAIProvider,
  };

  return (
    <ExtensionContext.Provider value={contextValue}>
      {children}
    </ExtensionContext.Provider>
  );
};

// Placeholder functions - will be implemented later
async function loadConfigFromStorage(): Promise<ExtensionConfig> {
  // Temporary default config
  return {
    version: "2.0.0",
    name: "NovelSynth",
    features: [],
    aiProviders: [],
    websiteHandlers: [],
  };
}

async function saveFeatureToStorage(_feature: FeatureConfig): Promise<void> {
  // Will implement with chrome.storage API
}

async function saveAIProviderToStorage(
  _provider: AIProviderConfig
): Promise<void> {
  // Will implement with chrome.storage API
}
