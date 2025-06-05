/**
 * Constants for NovelSynth
 * Centralized configuration values and prompts used throughout the extension
 */
export declare enum ContentType {
    NOVEL = "novel",
    ARTICLE = "article",
    NEWS = "news",
    TECHNICAL = "technical",
    GENERIC = "generic"
}
export declare enum PromptType {
    ENHANCEMENT = "enhancement",
    SUMMARY = "summary",
    PERMANENT = "permanent",
    WEBSITE = "website",
    NOVEL = "novel"
}
export declare const DEFAULT_ENHANCEMENT_PROMPTS: {
    novel: string;
    article: string;
    news: string;
    technical: string;
    generic: string;
};
export declare const DEFAULT_SUMMARY_PROMPTS: {
    novel: string;
    article: string;
    news: string;
    technical: string;
    generic: string;
};
export declare const PERMANENT_PROMPT = "\n\n**Formatting Requirements:**\n- Use only HTML paragraph tags (<p>) for each paragraph\n- Handle dialogue with appropriate punctuation and breaks\n- Do not use markdown formatting in your response\n- Preserve line breaks and paragraph structure\n- Maintain proper HTML formatting throughout";
export declare const WEBSITE_PROMPTS: {
    "fanfiction.net": string;
    "archiveofourown.org": string;
    "ranobes.net": string;
    "royalroad.com": string;
    "webnovel.com": string;
    "geeksforgeeks.org": string;
    "medium.com": string;
    generic: string;
};
export declare const NOVEL_PROMPTS: {
    default: string;
};
export declare const AI_MODELS: {
    gemini: {
        id: string;
        name: string;
        maxTokens: number;
    }[];
    openai: {
        id: string;
        name: string;
        maxTokens: number;
    }[];
    anthropic: {
        id: string;
        name: string;
        maxTokens: number;
    }[];
    huggingface: {
        id: string;
        name: string;
        maxTokens: number;
    }[];
    openrouter: {
        id: string;
        name: string;
        maxTokens: number;
    }[];
};
export declare const DEFAULT_CHUNK_SIZE = 12000;
export declare const RATE_LIMIT_WAIT_TIME = 300000;
export declare const DEFAULT_SETTINGS: {
    selectedProvider: string;
    selectedModel: string;
    enabledHandlers: string[];
    apiKeys: {};
    customPrompts: {
        enhancement: {};
        summary: {};
        website: {};
        novel: {};
    };
    autoDetectContentType: boolean;
    showWordCount: boolean;
    showProcessingBanner: boolean;
};
export declare const CONTENT_TYPE_PATTERNS: {
    novel: {
        domains: string[];
        pathPatterns: string[];
        contentIndicators: string[];
    };
    technical: {
        domains: string[];
        pathPatterns: string[];
        contentIndicators: string[];
    };
    news: {
        domains: string[];
        pathPatterns: string[];
        contentIndicators: string[];
    };
    article: {
        domains: string[];
        pathPatterns: string[];
        contentIndicators: string[];
    };
};
declare const _default: {
    ContentType: typeof ContentType;
    PromptType: typeof PromptType;
    DEFAULT_ENHANCEMENT_PROMPTS: {
        novel: string;
        article: string;
        news: string;
        technical: string;
        generic: string;
    };
    DEFAULT_SUMMARY_PROMPTS: {
        novel: string;
        article: string;
        news: string;
        technical: string;
        generic: string;
    };
    PERMANENT_PROMPT: string;
    WEBSITE_PROMPTS: {
        "fanfiction.net": string;
        "archiveofourown.org": string;
        "ranobes.net": string;
        "royalroad.com": string;
        "webnovel.com": string;
        "geeksforgeeks.org": string;
        "medium.com": string;
        generic: string;
    };
    NOVEL_PROMPTS: {
        default: string;
    };
    AI_MODELS: {
        gemini: {
            id: string;
            name: string;
            maxTokens: number;
        }[];
        openai: {
            id: string;
            name: string;
            maxTokens: number;
        }[];
        anthropic: {
            id: string;
            name: string;
            maxTokens: number;
        }[];
        huggingface: {
            id: string;
            name: string;
            maxTokens: number;
        }[];
        openrouter: {
            id: string;
            name: string;
            maxTokens: number;
        }[];
    };
    DEFAULT_CHUNK_SIZE: number;
    RATE_LIMIT_WAIT_TIME: number;
    DEFAULT_SETTINGS: {
        selectedProvider: string;
        selectedModel: string;
        enabledHandlers: string[];
        apiKeys: {};
        customPrompts: {
            enhancement: {};
            summary: {};
            website: {};
            novel: {};
        };
        autoDetectContentType: boolean;
        showWordCount: boolean;
        showProcessingBanner: boolean;
    };
    CONTENT_TYPE_PATTERNS: {
        novel: {
            domains: string[];
            pathPatterns: string[];
            contentIndicators: string[];
        };
        technical: {
            domains: string[];
            pathPatterns: string[];
            contentIndicators: string[];
        };
        news: {
            domains: string[];
            pathPatterns: string[];
            contentIndicators: string[];
        };
        article: {
            domains: string[];
            pathPatterns: string[];
            contentIndicators: string[];
        };
    };
};
export default _default;
