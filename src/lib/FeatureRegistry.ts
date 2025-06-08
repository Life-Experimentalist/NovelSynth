import {
  FeatureConfig,
  AIProviderConfig,
  WebsiteHandlerConfig,
  ContentType,
  FeatureCategory,
  PromptCategory,
  ModelCapability,
} from "../types/extension";

// Feature Registry - Central place to register all features
class FeatureRegistry {
  private features: Map<string, FeatureConfig> = new Map();
  private aiProviders: Map<string, AIProviderConfig> = new Map();
  private websiteHandlers: Map<string, WebsiteHandlerConfig> = new Map();

  // Register a new feature
  registerFeature(feature: FeatureConfig): void {
    this.features.set(feature.id, feature);
    console.log(`Registered feature: ${feature.name}`);
  }

  // Register a new AI provider
  registerAIProvider(provider: AIProviderConfig): void {
    this.aiProviders.set(provider.id, provider);
    console.log(`Registered AI provider: ${provider.name}`);
  }

  // Register a new website handler
  registerWebsiteHandler(handler: WebsiteHandlerConfig): void {
    this.websiteHandlers.set(handler.id, handler);
    console.log(`Registered website handler: ${handler.name}`);
  }

  // Get all registered features
  getFeatures(): FeatureConfig[] {
    return Array.from(this.features.values());
  }

  // Get all registered AI providers
  getAIProviders(): AIProviderConfig[] {
    return Array.from(this.aiProviders.values());
  }

  // Get all registered website handlers
  getWebsiteHandlers(): WebsiteHandlerConfig[] {
    return Array.from(this.websiteHandlers.values());
  }

  // Get feature by ID
  getFeature(id: string): FeatureConfig | undefined {
    return this.features.get(id);
  }

  // Get AI provider by ID
  getAIProvider(id: string): AIProviderConfig | undefined {
    return this.aiProviders.get(id);
  }

  // Get website handler by ID
  getWebsiteHandler(id: string): WebsiteHandlerConfig | undefined {
    return this.websiteHandlers.get(id);
  }

  // Get features by category
  getFeaturesByCategory(category: FeatureCategory): FeatureConfig[] {
    return Array.from(this.features.values()).filter(
      (f) => f.category === category
    );
  }

  // Get compatible AI providers for a feature
  getCompatibleAIProviders(featureId: string): AIProviderConfig[] {
    const feature = this.features.get(featureId);
    if (!feature) return [];

    return Array.from(this.aiProviders.values()).filter(
      (provider) =>
        provider.supportedFeatures.includes(featureId) ||
        provider.supportedFeatures.includes("*")
    );
  }

  // Auto-register all features, AI providers, and website handlers
  async autoRegister(): Promise<void> {
    await this.registerCoreFeatures();
    await this.registerCoreAIProviders();
    await this.registerCoreWebsiteHandlers();
  }

  private async registerCoreFeatures(): Promise<void> {
    // Register core features
    const coreFeatures: FeatureConfig[] = [
      {
        id: "enhance",
        name: "Enhance Text",
        description: "Improve grammar, style, and readability",
        icon: "✨",
        enabled: true,
        category: FeatureCategory.ENHANCEMENT,
        priority: 1,
        promptTemplates: [
          {
            id: "enhance_novel",
            name: "Novel Enhancement",
            content:
              "Improve the following text while maintaining the author's voice and style. Fix grammar, improve readability, and enhance flow:\n\n{content}",
            variables: [
              {
                name: "content",
                type: "string",
                description: "Text to enhance",
                required: true,
              },
            ],
            contentType: ContentType.NOVEL,
            category: PromptCategory.ENHANCEMENT,
          },
        ],
        supportedContentTypes: [
          ContentType.NOVEL,
          ContentType.FANFICTION,
          ContentType.GENERAL,
        ],
        defaultAIProvider: "gemini",
      },
      {
        id: "summarize",
        name: "Summarize",
        description: "Create concise summaries of long content",
        icon: "📝",
        enabled: true,
        category: FeatureCategory.ANALYSIS,
        priority: 2,
        promptTemplates: [
          {
            id: "summarize_chapter",
            name: "Chapter Summary",
            content:
              "Create a concise summary of this chapter, highlighting key plot points, character developments, and important events:\n\n{content}",
            variables: [
              {
                name: "content",
                type: "string",
                description: "Chapter content",
                required: true,
              },
            ],
            contentType: ContentType.NOVEL,
            category: PromptCategory.SUMMARIZATION,
          },
        ],
        supportedContentTypes: [
          ContentType.NOVEL,
          ContentType.NEWS,
          ContentType.ACADEMIC,
        ],
        defaultAIProvider: "gemini",
      },
      {
        id: "analyze_characters",
        name: "Character Analysis",
        description: "Analyze character development and relationships",
        icon: "👥",
        enabled: true,
        category: FeatureCategory.ANALYSIS,
        priority: 3,
        promptTemplates: [
          {
            id: "analyze_characters",
            name: "Character Analysis",
            content:
              "Analyze the characters in this text. Identify their roles, relationships, development, and significance to the plot:\n\n{content}",
            variables: [
              {
                name: "content",
                type: "string",
                description: "Text to analyze",
                required: true,
              },
            ],
            contentType: ContentType.NOVEL,
            category: PromptCategory.ANALYSIS,
          },
        ],
        supportedContentTypes: [ContentType.NOVEL, ContentType.FANFICTION],
        defaultAIProvider: "gemini",
      },
      {
        id: "translate",
        name: "Translate",
        description: "Translate content to different languages",
        icon: "🌍",
        enabled: true,
        category: FeatureCategory.TRANSLATION,
        priority: 4,
        promptTemplates: [
          {
            id: "translate_text",
            name: "Text Translation",
            content:
              "Translate the following text to {target_language}, maintaining the original meaning and style:\n\n{content}",
            variables: [
              {
                name: "content",
                type: "string",
                description: "Text to translate",
                required: true,
              },
              {
                name: "target_language",
                type: "string",
                description: "Target language",
                required: true,
                defaultValue: "English",
              },
            ],
            contentType: ContentType.GENERAL,
            category: PromptCategory.TRANSLATION,
          },
        ],
        supportedContentTypes: [
          ContentType.NOVEL,
          ContentType.FANFICTION,
          ContentType.NEWS,
          ContentType.GENERAL,
        ],
        defaultAIProvider: "gemini",
      },
      {
        id: "fix_grammar",
        name: "Fix Grammar",
        description: "Correct grammar and spelling errors",
        icon: "✏️",
        enabled: true,
        category: FeatureCategory.ENHANCEMENT,
        priority: 5,
        promptTemplates: [
          {
            id: "fix_grammar",
            name: "Grammar Correction",
            content:
              "Fix grammar, spelling, and punctuation errors in the following text while preserving the original meaning and style:\n\n{content}",
            variables: [
              {
                name: "content",
                type: "string",
                description: "Text to correct",
                required: true,
              },
            ],
            contentType: ContentType.GENERAL,
            category: PromptCategory.CORRECTION,
          },
        ],
        supportedContentTypes: [
          ContentType.NOVEL,
          ContentType.FANFICTION,
          ContentType.GENERAL,
        ],
        defaultAIProvider: "gemini",
      },
      {
        id: "plot_predict",
        name: "Plot Prediction",
        description: "Predict possible plot developments",
        icon: "🔮",
        enabled: true,
        category: FeatureCategory.ANALYSIS,
        priority: 6,
        promptTemplates: [
          {
            id: "plot_predict",
            name: "Plot Prediction",
            content:
              "Based on the following text, analyze the plot patterns and predict possible future developments. Consider character arcs, foreshadowing, and story structure:\n\n{content}",
            variables: [
              {
                name: "content",
                type: "string",
                description: "Text to analyze",
                required: true,
              },
            ],
            contentType: ContentType.NOVEL,
            category: PromptCategory.ANALYSIS,
          },
        ],
        supportedContentTypes: [ContentType.NOVEL, ContentType.FANFICTION],
        defaultAIProvider: "gemini",
      },
    ];

    coreFeatures.forEach((feature) => this.registerFeature(feature));
  }

  private async registerCoreAIProviders(): Promise<void> {
    // Register core AI providers
    const coreProviders: AIProviderConfig[] = [
      {
        id: "gemini",
        name: "gemini",
        displayName: "Google Gemini",
        enabled: true,
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
        models: [
          {
            id: "gemini-1.5-flash",
            name: "gemini-1.5-flash",
            displayName: "Gemini 1.5 Flash",
            maxTokens: 1048576,
            capabilities: [
              ModelCapability.TEXT_GENERATION,
              ModelCapability.SUMMARIZATION,
              ModelCapability.ANALYSIS,
              ModelCapability.TRANSLATION,
            ],
          },
          {
            id: "gemini-1.5-pro",
            name: "gemini-1.5-pro",
            displayName: "Gemini 1.5 Pro",
            maxTokens: 2097152,
            capabilities: [
              ModelCapability.TEXT_GENERATION,
              ModelCapability.SUMMARIZATION,
              ModelCapability.ANALYSIS,
              ModelCapability.TRANSLATION,
            ],
          },
        ],
        rateLimits: {
          requestsPerMinute: 15,
          requestsPerHour: 1000,
          requestsPerDay: 50000,
          retryAfter: 60,
          backoffMultiplier: 2,
        },
        supportedFeatures: ["*"], // Supports all features
      },
      {
        id: "openai",
        name: "openai",
        displayName: "OpenAI",
        enabled: false,
        baseUrl: "https://api.openai.com/v1",
        models: [
          {
            id: "gpt-4",
            name: "gpt-4",
            displayName: "GPT-4",
            maxTokens: 8192,
            capabilities: [
              ModelCapability.TEXT_GENERATION,
              ModelCapability.SUMMARIZATION,
              ModelCapability.ANALYSIS,
              ModelCapability.TRANSLATION,
            ],
          },
          {
            id: "gpt-3.5-turbo",
            name: "gpt-3.5-turbo",
            displayName: "GPT-3.5 Turbo",
            maxTokens: 4096,
            capabilities: [
              ModelCapability.TEXT_GENERATION,
              ModelCapability.SUMMARIZATION,
              ModelCapability.ANALYSIS,
              ModelCapability.TRANSLATION,
            ],
          },
        ],
        rateLimits: {
          requestsPerMinute: 3,
          requestsPerHour: 200,
          requestsPerDay: 10000,
          retryAfter: 60,
          backoffMultiplier: 2,
        },
        supportedFeatures: ["*"],
      },
    ];

    coreProviders.forEach((provider) => this.registerAIProvider(provider));
  }

  private async registerCoreWebsiteHandlers(): Promise<void> {
    // Register core website handlers
    const coreHandlers: WebsiteHandlerConfig[] = [
      {
        id: "fanfiction_net",
        name: "FanFiction.Net",
        domains: ["fanfiction.net", "www.fanfiction.net"],
        enabled: true,
        priority: 100,
        contentSelectors: [
          {
            type: ContentType.FANFICTION,
            selector: "#storytext",
            priority: 1,
          },
        ],
      },
      {
        id: "archiveofourown",
        name: "Archive of Our Own",
        domains: ["archiveofourown.org", "ao3.org"],
        enabled: true,
        priority: 100,
        contentSelectors: [
          {
            type: ContentType.FANFICTION,
            selector: ".userstuff",
            priority: 1,
          },
        ],
      },
      {
        id: "royal_road",
        name: "Royal Road",
        domains: ["royalroad.com", "www.royalroad.com"],
        enabled: true,
        priority: 100,
        contentSelectors: [
          {
            type: ContentType.NOVEL,
            selector: ".chapter-content",
            priority: 1,
          },
        ],
      },
      {
        id: "webnovel",
        name: "WebNovel",
        domains: ["webnovel.com", "www.webnovel.com"],
        enabled: true,
        priority: 100,
        contentSelectors: [
          {
            type: ContentType.NOVEL,
            selector: ".cha-content",
            priority: 1,
          },
        ],
      },
      {
        id: "generic",
        name: "Generic Website",
        domains: ["*"],
        enabled: true,
        priority: 1,
        contentSelectors: [
          {
            type: ContentType.GENERAL,
            selector: "article",
            priority: 3,
          },
          {
            type: ContentType.GENERAL,
            selector: "main",
            priority: 2,
          },
          {
            type: ContentType.GENERAL,
            selector: ".content",
            priority: 1,
          },
        ],
      },
    ];

    coreHandlers.forEach((handler) => this.registerWebsiteHandler(handler));
  }
}

// Create and export the global registry instance
export const featureRegistry = new FeatureRegistry();

// Auto-register core features when module loads
featureRegistry.autoRegister().catch(console.error);

// Helper functions for easy feature registration
export const registerFeature = (feature: FeatureConfig) =>
  featureRegistry.registerFeature(feature);
export const registerAIProvider = (provider: AIProviderConfig) =>
  featureRegistry.registerAIProvider(provider);
export const registerWebsiteHandler = (handler: WebsiteHandlerConfig) =>
  featureRegistry.registerWebsiteHandler(handler);
