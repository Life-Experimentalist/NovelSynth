// Core extension types for NovelSynth
export interface ExtensionConfig {
  version: string;
  name: string;
  features: FeatureConfig[];
  aiProviders: AIProviderConfig[];
  websiteHandlers: WebsiteHandlerConfig[];
}

export interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  category: FeatureCategory;
  priority: number; // For button ordering
  promptTemplates: PromptTemplate[];
  supportedContentTypes: ContentType[];
  supportedModes?: string[]; // Add support for content modes
  defaultAIProvider?: string;
  defaultModel?: string;
  modelPreferences?: Record<string, string>; // Per-mode model selection
}

export interface AIProviderConfig {
  id: string;
  name: string;
  displayName: string;
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  models: AIModel[];
  rateLimits: RateLimitConfig;
  supportedFeatures: string[];
}

export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  maxTokens: number;
  costPerToken?: number;
  capabilities: ModelCapability[];
}

export interface WebsiteHandlerConfig {
  id: string;
  name: string;
  domains: string[];
  contentSelectors: ContentSelector[];
  enabled: boolean;
  priority: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  variables: PromptVariable[];
  contentType: ContentType;
  category: PromptCategory;
}

export interface ContentSelector {
  type: ContentType;
  selector: string;
  priority: number;
  validation?: (element: Element) => boolean;
}

// Enums
export enum FeatureCategory {
  ENHANCEMENT = "enhancement",
  ANALYSIS = "analysis",
  UTILITY = "utility",
  TRANSLATION = "translation",
}

export enum ContentType {
  NOVEL = "novel",
  FANFICTION = "fanfiction",
  NEWS = "news",
  ACADEMIC = "academic",
  TECHNICAL = "technical",
  GENERAL = "general",
}

export enum ModelCapability {
  TEXT_GENERATION = "text_generation",
  SUMMARIZATION = "summarization",
  TRANSLATION = "translation",
  ANALYSIS = "analysis",
  CONVERSATION = "conversation",
}

export enum PromptCategory {
  ENHANCEMENT = "enhancement",
  SUMMARIZATION = "summarization",
  ANALYSIS = "analysis",
  TRANSLATION = "translation",
  CORRECTION = "correction",
}

export interface PromptVariable {
  name: string;
  type: "string" | "number" | "boolean";
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  retryAfter: number;
  backoffMultiplier: number;
}

// UI State Types
export interface UIState {
  isPopupOpen: boolean;
  isFloatingPanelOpen: boolean;
  selectedFeature?: string;
  processingFeature?: string;
  activeContentType?: ContentType;
  theme: "light" | "dark" | "auto";
}

// Feature Execution Types
export interface FeatureExecution {
  featureId: string;
  contentType: ContentType;
  selectedContent: string;
  aiProvider: string;
  model: string;
  promptTemplate: string;
  variables: Record<string, any>;
}

export interface FeatureResult {
  featureId: string;
  success: boolean;
  result?: string;
  error?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}
