// Core AI Service Interface
export interface AIService {
  id: string;
  name: string;
  icon: string;
  models: AIModel[];
  isConfigured: boolean;
  validateApiKey: (apiKey: string) => Promise<boolean>;
  getModels: () => Promise<AIModel[]>;
  refreshModels: () => Promise<AIModel[]>; // Required method for refreshing models
  processRequest: (request: AIRequest) => Promise<AIResponse>;
}

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  maxTokens?: number;
  supportedModes: ContentMode[];
}

export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  content: string;
  mode: ContentMode;
  model: string;
  config?: Record<string, any>;
}

export interface AIResponse {
  result: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  error?: string;
}

// Content Types and Modes
export type ContentMode =
  | "novel"
  | "article"
  | "news"
  | "educational"
  | "code"
  | "general";

export interface ContentHandler {
  id: string;
  name: string;
  domains: string[];
  detectContentType: () => ContentMode;
  extractContent: () => ExtractedContent;
  canHandle: (url: string) => boolean;
}

export interface ExtractedContent {
  title: string;
  content: string;
  contentType: ContentMode;
  metadata?: Record<string, any>;
}

// Feature System
export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "enhance" | "analyze" | "transform" | "utility";
  supportedModes: ContentMode[];
  defaultPrompts: Record<ContentMode, string>;
  defaultSystemPrompts: Record<ContentMode, string>;
  isRecent: boolean;
  config: FeatureConfig;
}

export interface FeatureConfig {
  serviceId: string;
  modelId: string;
  modelPreferences?: Record<ContentMode, string>; // Per-mode model selection
  customPrompts: Record<ContentMode, string>;
  customSystemPrompts: Record<ContentMode, string>;
  enabled: boolean;
}

// UI Components
export interface PopupState {
  isFloatingVisible: boolean;
  selectedService: string;
  recentFeatures: string[];
  activeFeature: string | null;
}

// Storage Schema
export interface ExtensionStorage {
  services: Record<
    string,
    {
      apiKey: string;
      selectedModel: string;
      isConfigured: boolean;
    }
  >;
  features: Record<string, FeatureConfig>;
  ui: {
    recentFeatures: string[];
    floatingPopupEnabled: boolean;
  };
  prompts: Record<string, Record<ContentMode, string>>;
}
