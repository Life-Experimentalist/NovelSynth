import type { Feature } from "@/types";

export const defaultFeatures: Feature[] = [
  {
    id: "enhance",
    name: "Enhance Text",
    description: "Improve readability and flow of the content",
    icon: "✨",
    category: "enhance",
    supportedModes: ["novel", "article", "general"],
    isRecent: false,
    defaultSystemPrompts: {
      novel:
        "You are an expert editor specializing in creative writing and novels. Your task is to enhance text while preserving the author's voice, style, and narrative integrity. Focus on improving readability, flow, and narrative quality.",
      article:
        "You are a professional editor specializing in articles and non-fiction content. Your task is to enhance text while maintaining factual accuracy and the author's intended message. Focus on improving clarity, structure, and readability.",
      news: "You are a professional news editor. Your task is to enhance news content while maintaining strict factual accuracy and journalistic integrity. Focus on clarity and readability without altering facts.",
      educational:
        "You are an educational content specialist. Your task is to enhance educational material to make it more engaging and accessible to learners while maintaining academic accuracy.",
      code: "You are a senior software developer and technical writer. Your task is to enhance code readability and documentation while maintaining functionality.",
      general:
        "You are a professional editor. Your task is to enhance text by improving clarity, flow, and readability while maintaining the original meaning and tone.",
    },
    defaultPrompts: {
      novel:
        "Please enhance this novel text by improving readability, flow, and narrative quality while maintaining the original story and style.",
      article:
        "Please enhance this article by improving clarity, structure, and readability while maintaining the core message.",
      news: "Please enhance this news content by improving clarity and readability while maintaining factual accuracy.",
      educational:
        "Please enhance this educational content by improving clarity and making it more engaging for learners.",
      code: "Please enhance this code by improving readability and adding helpful comments.",
      general:
        "Please enhance this text by improving clarity, flow, and readability.",
    },
    config: {
      serviceId: "gemini",
      modelId: "gemini-pro",
      customPrompts: {
        novel: "",
        article: "",
        news: "",
        educational: "",
        code: "",
        general: "",
      },
      customSystemPrompts: {
        novel: "",
        article: "",
        news: "",
        educational: "",
        code: "",
        general: "",
      },
      enabled: true,
    },
  },
  {
    id: "summarize",
    name: "Summarize",
    description: "Create a concise summary of the content",
    icon: "📝",
    category: "analyze",
    supportedModes: ["novel", "article", "news", "educational", "general"],
    isRecent: false,
    defaultSystemPrompts: {
      novel:
        "You are a literary analyst specializing in summarizing novels and creative works. Create concise, informative summaries that capture key plot points, character development, and themes without spoilers.",
      article:
        "You are a professional summarizer specializing in articles and non-fiction content. Create clear, concise summaries that capture the main points and key insights while maintaining accuracy.",
      news: "You are a news analyst. Create accurate, concise summaries of news articles that highlight key facts, developments, and implications while maintaining journalistic integrity.",
      educational:
        "You are an educational content specialist. Create summaries that highlight main concepts, learning objectives, and key takeaways in an accessible format for learners.",
      code: "You are a senior software developer. Create summaries that explain what code does, its main functions, purpose, and key implementation details.",
      general:
        "You are a professional content summarizer. Create clear, concise summaries that capture the main points and essential information from any type of content.",
    },
    defaultPrompts: {
      novel:
        "Please provide a concise summary of this novel chapter or section, highlighting key plot points and character developments.",
      article:
        "Please provide a concise summary of this article, highlighting the main points and key insights.",
      news: "Please provide a concise summary of this news article, highlighting the key facts and developments.",
      educational:
        "Please provide a concise summary of this educational content, highlighting the main concepts and learning objectives.",
      code: "Please provide a summary of what this code does, including its main functions and purpose.",
      general:
        "Please provide a concise summary of this content, highlighting the main points.",
    },
    config: {
      serviceId: "gemini",
      modelId: "gemini-pro",
      customPrompts: {
        novel: "",
        article: "",
        news: "",
        educational: "",
        code: "",
        general: "",
      },
      customSystemPrompts: {
        novel: "",
        article: "",
        news: "",
        educational: "",
        code: "",
        general: "",
      },
      enabled: true,
    },
  },
  {
    id: "explain",
    name: "Explain",
    description: "Provide detailed explanations of complex concepts",
    icon: "💡",
    category: "analyze",
    supportedModes: ["educational", "code", "article", "general"],
    isRecent: false,
    defaultSystemPrompts: {
      novel:
        "You are a literary scholar and educator. Provide detailed explanations of themes, symbolism, literary devices, and narrative techniques in an accessible way.",
      article:
        "You are an expert educator specializing in breaking down complex topics. Explain concepts clearly with examples, analogies, and structured information that's easy to understand.",
      news: "You are a news analyst and educator. Provide clear explanations of background context, implications, and significance of news events for better understanding.",
      educational:
        "You are an expert teacher and educational content creator. Provide detailed, clear explanations with examples, analogies, and structured information that enhances learning.",
      code: "You are a senior software engineer and technical educator. Explain code logic, algorithms, design patterns, and best practices in a clear, educational manner.",
      general:
        "You are an expert educator. Provide clear, detailed explanations of any topic with examples and context to enhance understanding.",
    },
    defaultPrompts: {
      novel:
        "Please explain the themes, symbolism, and literary devices used in this novel text.",
      article:
        "Please explain the key concepts and ideas presented in this article in simple terms.",
      news: "Please explain the background context and implications of this news story.",
      educational:
        "Please explain these concepts in detail with examples to help with understanding.",
      code: "Please explain how this code works, including its logic, algorithms, and best practices.",
      general:
        "Please provide a detailed explanation of the concepts presented in this content.",
    },
    config: {
      serviceId: "gemini",
      modelId: "gemini-pro",
      customPrompts: {
        novel: "",
        article: "",
        news: "",
        educational: "",
        code: "",
        general: "",
      },
      customSystemPrompts: {
        novel: "",
        article: "",
        news: "",
        educational: "",
        code: "",
        general: "",
      },
      enabled: true,
    },
  },
  {
    id: "translate",
    name: "Translate",
    description: "Translate content to different languages",
    icon: "🌐",
    category: "transform",
    supportedModes: ["novel", "article", "news", "educational", "general"],
    isRecent: false,
    defaultSystemPrompts: {
      novel:
        "You are a professional literary translator specializing in creative works. Translate while preserving the author's style, tone, cultural nuances, and narrative voice. Maintain literary quality and readability in the target language.",
      article:
        "You are a professional translator specializing in articles and non-fiction content. Translate while maintaining accuracy, clarity, and the author's intended meaning. Preserve technical terms and concepts appropriately.",
      news: "You are a professional news translator. Translate while maintaining strict accuracy of facts, proper names, and journalistic integrity. Preserve the formal tone and structure of news content.",
      educational:
        "You are an educational content translator. Translate while maintaining clarity, accuracy, and educational value. Ensure concepts remain accessible and learning objectives are preserved.",
      code: "You are a technical translator specializing in code documentation. Translate comments and documentation while preserving technical accuracy and maintaining code functionality context.",
      general:
        "You are a professional translator. Provide accurate, natural-sounding translations that preserve the original meaning, tone, and intent of the content.",
    },
    defaultPrompts: {
      novel:
        "Please translate this novel text to [TARGET_LANGUAGE], preserving the narrative style and character voices.",
      article:
        "Please translate this article to [TARGET_LANGUAGE], maintaining clarity and accuracy.",
      news: "Please translate this news content to [TARGET_LANGUAGE], preserving factual accuracy.",
      educational:
        "Please translate this educational content to [TARGET_LANGUAGE], maintaining learning value.",
      code: "Please translate the comments and documentation in this code to [TARGET_LANGUAGE].",
      general: "Please translate this content to [TARGET_LANGUAGE].",
    },
    config: {
      serviceId: "gemini",
      modelId: "gemini-pro",
      customPrompts: {
        novel: "",
        article: "",
        news: "",
        educational: "",
        code: "",
        general: "",
      },
      customSystemPrompts: {
        novel: "",
        article: "",
        news: "",
        educational: "",
        code: "",
        general: "",
      },
      enabled: true,
    },
  },
];
