/**
 * Constants for NovelSynth
 * Centralized configuration values and prompts used throughout the extension
 */

export enum ContentType {
  NOVEL = "novel",
  ARTICLE = "article",
  NEWS = "news",
  TECHNICAL = "technical",
  GENERIC = "generic",
}

export enum PromptType {
  ENHANCEMENT = "enhancement",
  SUMMARY = "summary",
  PERMANENT = "permanent",
  WEBSITE = "website",
  NOVEL = "novel",
}

// Default Enhancement Prompts
export const DEFAULT_ENHANCEMENT_PROMPTS = {
  [ContentType.NOVEL]: `Please enhance this novel chapter translation with the following improvements:

1. Fix grammatical errors, punctuation mistakes, and spelling issues
2. Improve the narrative flow and overall readability
3. Ensure consistent character voice, tone, and gender pronouns throughout
4. Make dialogue sound more natural and conversational
5. Refine descriptions to be more vivid and engaging
6. Maintain the original plot points, character development, and story elements exactly
7. Streamline overly verbose sections while preserving important details
8. Ensure proper transitioning between scenes and ideas
9. Add bold section headings at scene changes, POV shifts, or topic transitions
10. **IMPORTANT:** Format game-like status windows, character stats, skill lists, or RPG system information into styled HTML boxes. Use a div with class="game-stats-box" to contain the exact text.
11. Remove any advertising code snippets or irrelevant promotional content

Keep the core meaning of the original text intact while making it feel like a professionally translated novel.`,

  [ContentType.ARTICLE]: `Please enhance this article with the following improvements:

1. Fix grammatical errors, punctuation mistakes, and spelling issues
2. Improve clarity and readability while maintaining technical accuracy
3. Ensure consistent terminology and professional tone
4. Enhance paragraph structure and logical flow
5. Improve transitions between sections and ideas
6. Make complex concepts more accessible without dumbing down the content
7. Ensure proper formatting of lists, code snippets, and technical references
8. Remove any advertising or irrelevant promotional content
9. Maintain all original facts, data, and references exactly
10. Preserve the author's intended message and conclusions`,

  [ContentType.NEWS]: `Please enhance this news article with the following improvements:

1. Fix grammatical errors, punctuation mistakes, and spelling issues
2. Improve clarity and readability while maintaining journalistic integrity
3. Ensure objective and professional tone throughout
4. Enhance paragraph structure for better information flow
5. Improve transitions between different aspects of the story
6. Make complex information more accessible to general readers
7. Ensure proper attribution and quote formatting
8. Remove any advertising or irrelevant promotional content
9. Maintain all original facts, sources, and quotes exactly
10. Preserve the journalistic style and news format`,

  [ContentType.TECHNICAL]: `Please enhance this technical documentation with the following improvements:

1. Fix grammatical errors, punctuation mistakes, and spelling issues
2. Improve clarity and technical accuracy
3. Ensure consistent technical terminology and professional tone
4. Enhance code examples and technical explanations
5. Improve step-by-step instructions and procedures
6. Make complex technical concepts more understandable
7. Ensure proper formatting of code blocks, lists, and references
8. Remove any advertising or irrelevant promotional content
9. Maintain all original technical details, code, and specifications exactly
10. Preserve the instructional format and technical accuracy`,

  [ContentType.GENERIC]: `Please enhance this content with the following improvements:

1. Fix grammatical errors, punctuation mistakes, and spelling issues
2. Improve overall clarity and readability
3. Ensure consistent tone and style throughout
4. Enhance paragraph structure and logical flow
5. Improve transitions between sections and ideas
6. Make the content more engaging while preserving the original message
7. Ensure proper formatting and structure
8. Remove any advertising or irrelevant promotional content
9. Maintain all original facts and key information exactly
10. Preserve the author's intended message and style`,
};

// Default Summary Prompts
export const DEFAULT_SUMMARY_PROMPTS = {
  [ContentType.NOVEL]: `Please generate a comprehensive summary of this novel chapter, ensuring the following aspects are covered:

1. **Major Plot Points:** Detail the main sequence of events and key developments
2. **Character Interactions & Development:** Describe significant character interactions and growth
3. **Key Reveals & Information:** Mention crucial information, secrets, or plot twists
4. **Setting & Atmosphere:** Include significant setting details and mood changes
5. **Thematic Elements:** Touch upon central themes introduced or developed
6. **Character Dynamics:** Highlight relationship changes or emotional shifts
7. **Foreshadowing:** Note hints or setup for future events
8. **Conflict & Tension:** Identify internal or external conflicts
9. **Character Names & Titles:** Ensure accurate representation of all names
10. **Important Objects or Artifacts:** Note significant items introduced

The summary must be thorough and accurate, capturing the essential substance of the chapter.`,

  [ContentType.ARTICLE]: `Please generate a concise summary of this article, focusing on:

1. **Main Topic:** Clearly identify the primary subject matter
2. **Key Arguments:** Outline the main points and arguments presented
3. **Evidence & Examples:** Summarize supporting evidence and examples
4. **Conclusions:** Highlight the author's main conclusions or findings
5. **Methodology:** If applicable, describe research methods or approaches
6. **Implications:** Note broader implications or significance
7. **Key Data:** Include important statistics or findings
8. **Recommendations:** Summarize any recommendations made

Ensure accuracy and include only information explicitly present in the article.`,

  [ContentType.NEWS]: `Please generate a news summary covering:

1. **Main Event:** Clearly describe what happened
2. **Who:** Identify key people, organizations, or entities involved
3. **When & Where:** Specify timing and location of events
4. **Why:** Explain causes, motivations, or background
5. **Impact:** Describe consequences or implications
6. **Sources:** Note key sources and quotes
7. **Context:** Provide relevant background information
8. **Current Status:** Describe the current situation

Follow journalistic standards and maintain objectivity throughout the summary.`,

  [ContentType.TECHNICAL]: `Please generate a technical summary including:

1. **Main Topic:** Identify the primary technical subject
2. **Key Concepts:** Outline main technical concepts explained
3. **Procedures:** Summarize step-by-step processes or methods
4. **Requirements:** List prerequisites or requirements
5. **Examples:** Note important code examples or demonstrations
6. **Best Practices:** Highlight recommended approaches
7. **Common Issues:** Mention troubleshooting or common problems
8. **Tools & Technologies:** List relevant tools or technologies discussed

Maintain technical accuracy and include all critical implementation details.`,

  [ContentType.GENERIC]: `Please generate a comprehensive summary including:

1. **Main Topic:** Clearly identify the primary subject
2. **Key Points:** Outline the most important information
3. **Structure:** Describe how the content is organized
4. **Arguments:** Summarize main arguments or positions
5. **Evidence:** Note supporting evidence or examples
6. **Conclusions:** Highlight main takeaways or conclusions
7. **Significance:** Explain the importance or relevance

Ensure completeness while maintaining clarity and conciseness.`,
};

// Permanent Prompt (always appended)
export const PERMANENT_PROMPT = `

**Formatting Requirements:**
- Use only HTML paragraph tags (<p>) for each paragraph
- Handle dialogue with appropriate punctuation and breaks
- Do not use markdown formatting in your response
- Preserve line breaks and paragraph structure
- Maintain proper HTML formatting throughout`;

// Website-specific prompts (for handlers)
export const WEBSITE_PROMPTS = {
  "fanfiction.net":
    "This is a fanfiction from Fanfiction.net. Please maintain the author's style and any formatting features like section breaks, centered text, italics, etc. Respect any special formatting the author uses for dialogue, thoughts, flashbacks, or scene transitions.",

  "archiveofourown.org":
    "This is a fanfiction from Archive of Our Own. Please maintain the author's original style and respect any special formatting, tags, or content warnings. Preserve the unique voice and creative choices of the fan author.",

  "ranobes.net":
    "This is a machine-translated web novel from a Russian novel site. Please improve the translation while maintaining the original meaning and flow. Keep any special formatting like section breaks. Russian and Chinese names should be properly transliterated.",

  "royalroad.com":
    "This is a web novel from Royal Road. Please maintain the author's writing style and any LitRPG or fantasy elements. Preserve any stat blocks, skill descriptions, or game-like elements in proper formatting.",

  "webnovel.com":
    "This is a web novel that may include translated content. Please enhance readability while preserving cultural references and proper nouns. Maintain any cultivation, system, or fantasy elements appropriately.",

  "geeksforgeeks.org":
    "This is a technical article from GeeksforGeeks. Please maintain technical accuracy and preserve all code examples exactly. Enhance explanations for clarity while keeping the educational format.",

  "medium.com":
    "This is an article from Medium. Please maintain the author's personal voice and style while enhancing clarity and readability. Preserve any personal anecdotes or unique perspectives.",

  generic:
    "Please enhance this content while maintaining its original style, format, and intent.",
};

// Novel-specific prompts (can be customized per novel)
export const NOVEL_PROMPTS = {
  // These will be dynamically created and stored based on detected novels
  default:
    "Please maintain consistency with the established characters, world-building, and narrative style of this novel series.",
};

// Model configurations for different AI providers
export const AI_MODELS = {
  gemini: [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", maxTokens: 2097152 },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", maxTokens: 1048576 },
    { id: "gemini-pro", name: "Gemini Pro", maxTokens: 32768 },
  ],
  openai: [
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", maxTokens: 128000 },
    { id: "gpt-4", name: "GPT-4", maxTokens: 32768 },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", maxTokens: 16384 },
  ],
  anthropic: [
    { id: "claude-3-opus-20240229", name: "Claude 3 Opus", maxTokens: 200000 },
    {
      id: "claude-3-sonnet-20240229",
      name: "Claude 3 Sonnet",
      maxTokens: 200000,
    },
    {
      id: "claude-3-haiku-20240307",
      name: "Claude 3 Haiku",
      maxTokens: 200000,
    },
  ],
  huggingface: [
    { id: "microsoft/DialoGPT-large", name: "DialoGPT Large", maxTokens: 1024 },
    {
      id: "facebook/blenderbot-400M-distill",
      name: "BlenderBot 400M",
      maxTokens: 512,
    },
  ],
  openrouter: [
    {
      id: "meta-llama/llama-3.2-3b-instruct:free",
      name: "Llama 3.2 3B (Free)",
      maxTokens: 32768,
    },
    {
      id: "microsoft/wizardlm-2-8x22b",
      name: "WizardLM-2 8x22B",
      maxTokens: 65536,
    },
    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      maxTokens: 200000,
    },
  ],
};

// Default chunk size for large content (characters per segment)
export const DEFAULT_CHUNK_SIZE = 12000;

// Rate limit settings
export const RATE_LIMIT_WAIT_TIME = 300000; // 5 minutes

// Default settings
export const DEFAULT_SETTINGS = {
  selectedProvider: "gemini",
  selectedModel: "gemini-1.5-pro",
  enabledHandlers: [
    "fanfiction.net",
    "archiveofourown.org",
    "royalroad.com",
    "webnovel.com",
    "geeksforgeeks.org",
    "medium.com",
  ],
  apiKeys: {},
  customPrompts: {
    enhancement: {},
    summary: {},
    website: {},
    novel: {},
  },
  autoDetectContentType: true,
  showWordCount: true,
  showProcessingBanner: true,
};

// Content type detection patterns
export const CONTENT_TYPE_PATTERNS = {
  [ContentType.NOVEL]: {
    domains: [
      "fanfiction.net",
      "archiveofourown.org",
      "royalroad.com",
      "webnovel.com",
      "ranobes.net",
    ],
    pathPatterns: ["/chapter", "/story", "/fiction", "/novel"],
    contentIndicators: ["chapter", "volume", "protagonist", "dialogue"],
  },
  [ContentType.TECHNICAL]: {
    domains: [
      "geeksforgeeks.org",
      "stackoverflow.com",
      "developer.mozilla.org",
      "docs.microsoft.com",
    ],
    pathPatterns: ["/tutorial", "/guide", "/docs", "/api"],
    contentIndicators: [
      "code",
      "function",
      "class",
      "algorithm",
      "implementation",
    ],
  },
  [ContentType.NEWS]: {
    domains: ["cnn.com", "bbc.com", "reuters.com", "ap.org", "news.com"],
    pathPatterns: ["/news", "/politics", "/world", "/business"],
    contentIndicators: ["breaking", "reported", "according to", "sources say"],
  },
  [ContentType.ARTICLE]: {
    domains: ["medium.com", "substack.com", "blog.", "wordpress.com"],
    pathPatterns: ["/article", "/post", "/blog"],
    contentIndicators: ["author", "published", "opinion", "analysis"],
  },
};

export default {
  ContentType,
  PromptType,
  DEFAULT_ENHANCEMENT_PROMPTS,
  DEFAULT_SUMMARY_PROMPTS,
  PERMANENT_PROMPT,
  WEBSITE_PROMPTS,
  NOVEL_PROMPTS,
  AI_MODELS,
  DEFAULT_CHUNK_SIZE,
  RATE_LIMIT_WAIT_TIME,
  DEFAULT_SETTINGS,
  CONTENT_TYPE_PATTERNS,
};
