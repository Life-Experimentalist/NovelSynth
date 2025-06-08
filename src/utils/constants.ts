/**
 * Constants for NovelSynth
 * Centralized configuration values and prompts used throughout the extension
 */

import type { ContentMode } from "@/types";

// Content modes
export const CONTENT_MODES = {
  NOVEL: "novel" as ContentMode,
  NEWS: "news" as ContentMode,
  LEARNING: "learning" as ContentMode,
  TECHNICAL: "technical" as ContentMode,
  ARTICLE: "article" as ContentMode,
} as const;

// Website handlers categorization
export const WEBSITE_HANDLERS = {
  novel: [
    "fanfiction.net",
    "archiveofourown.org",
    "wattpad.com",
    "ranobes.net",
    "lightnovelpub.com",
    "novelupdates.com",
    "webnovel.com",
    "royalroad.com",
  ],
  news: [
    "bbc.com",
    "cnn.com",
    "reuters.com",
    "theguardian.com",
    "nytimes.com",
    "washingtonpost.com",
  ],
  learning: [
    "wikipedia.org",
    "khan-academy.org",
    "coursera.org",
    "edx.org",
    "udemy.com",
    "stackoverflow.com",
  ],
  technical: [
    "github.com",
    "stackoverflow.com",
    "developer.mozilla.org",
    "docs.microsoft.com",
    "readthedocs.io",
  ],
} as const;

// Default model settings per function
export const DEFAULT_MODEL_SETTINGS = {
  enhance: {
    temperature: 0.7,
    maxTokens: 8192,
    model: "gemini-1.5-flash",
  },
  analyze: {
    temperature: 0.3,
    maxTokens: 4096,
    model: "gemini-1.5-flash",
  },
  summarize: {
    temperature: 0.5,
    maxTokens: 2048,
    model: "gemini-1.5-flash",
  },
  suggestions: {
    temperature: 0.8,
    maxTokens: 4096,
    model: "gemini-1.5-flash",
  },
} as const;

// Complete Gemini model list for dynamic selection
export const GEMINI_MODELS = [
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Fast and efficient model for most tasks",
    maxTokens: 1048576, // 1M tokens
    contextWindow: 1000000,
    recommended: true,
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash 8B",
    description: "Smaller, faster version of Flash model",
    maxTokens: 1048576,
    contextWindow: 1000000,
    recommended: false,
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "Most capable model for complex reasoning tasks",
    maxTokens: 2097152, // 2M tokens
    contextWindow: 2000000,
    recommended: true,
  },
  {
    id: "gemini-1.5-pro-002",
    name: "Gemini 1.5 Pro 002",
    description: "Latest version of Pro model with improved capabilities",
    maxTokens: 2097152,
    contextWindow: 2000000,
    recommended: true,
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    description: "Previous generation model (legacy)",
    maxTokens: 30720,
    contextWindow: 30720,
    recommended: false,
  },
  {
    id: "gemini-1.0-pro-vision",
    name: "Gemini 1.0 Pro Vision",
    description: "Multimodal model that can process images (legacy)",
    maxTokens: 30720,
    contextWindow: 30720,
    recommended: false,
  },
  {
    id: "gemini-exp-1114",
    name: "Gemini Experimental 1114",
    description: "Experimental model with latest features",
    maxTokens: 2097152,
    contextWindow: 2000000,
    recommended: false,
  },
  {
    id: "gemini-exp-1121",
    name: "Gemini Experimental 1121",
    description: "Latest experimental model",
    maxTokens: 2097152,
    contextWindow: 2000000,
    recommended: false,
  },
] as const;

// Novel-specific prompts
export const NOVEL_PROMPTS = {
  enhance: `Please enhance this novel chapter translation with the following improvements:

1. Fix grammatical errors, punctuation mistakes, and spelling issues
2. Improve the narrative flow and overall readability
3. Ensure consistent character voice, tone, and gender pronouns throughout
4. Make dialogue sound more natural and conversational
5. Refine descriptions to be more vivid and engaging
6. Maintain the original plot points, character development, and story elements exactly
7. Streamline overly verbose sections while preserving important details
8. Ensure proper transitioning between scenes and ideas
9. Add bold section headings at scene changes, POV shifts, or topic transitions. If the original text already has section headings, incorporate them seamlessly and consistently. Make sure that the section headings are not too long, and do not use any special characters or symbols in the headings. Use only standard English letters and numbers.
10. **IMPORTANT:** Format game-like status windows, character stats, skill lists, or RPG system information into styled HTML boxes. Use a div with class="game-stats-box" to contain the exact text. For example, a status window like:
    Player: Mike
    Level: 0
    Equipment: None
    Skills: None
    Class: Unspecialized
    Experience: 0
    Overall Combat Power: 5

    Should be formatted as:
    <div class="game-stats-box">
		Player: Mike
		Level: 0
		Equipment: None
		Skills: None
		Class: Unspecialized
		Experience: 0
		Overall Combat Power: 5
	</div>

    Preserve all line breaks, formatting, and exact data within these status windows. if there are any text in [ square brackets ] please pay attention to if they sound like system announcements or game-like status windows, and format them accordingly. If there are any consecutive [ square boxes ] then combine then into a single div. Be especially attentive to identifying stat blocks, status screens, system messages, skill descriptions, or any RPG-game-like information that should be formatted this way.
11. Remove any advertising code snippets or irrelevant promotional content

Keep the core meaning of the original text intact while making it feel like a professionally translated novel. Preserve all original story elements including character names, locations, and plot points precisely.`,

  summarize: `Please generate a comprehensive summary of the provided novel chapter, ensuring the following aspects are covered:

1.  **Major Plot Points:** Detail the main sequence of events and key developments that advance the story within this chapter.
2.  **Character Interactions & Development:** Describe significant interactions between characters, notable character introductions, important decisions made by characters, and any expressed motivations or changes in character state.
3.  **Key Reveals & Information:** Clearly mention any crucial information revealed, secrets uncovered, unique abilities or concepts introduced (like 'Sacred Gear'), prophecies, or significant plot twists occurring in this chapter.
4.  **Setting & Atmosphere:** Briefly incorporate significant details about the setting(s) and any notable shifts in mood, tone, or atmosphere relevant to the chapter's events.
5.  **Thematic Elements:** Touch upon any central themes that are prominent or introduced within this specific chapter (e.g., survival, fear, destiny, adjustment).
6.  **Character Dynamics:** Highlight any changes in relationships or dynamics between characters, including alliances, rivalries, or emotional shifts.
7.  **Foreshadowing & Future Implications:** Note any hints or foreshadowing of future events, character arcs, or plot developments that are introduced in this chapter.
8.  **Conflict & Tension:** Identify any conflicts (internal or external) that arise in this chapter, including character struggles, interpersonal conflicts, or larger narrative tensions.
9.  **Symbolism & Motifs:** Mention any recurring symbols, motifs, or imagery that are significant to the chapter's content.
10. **Narrative Style & Tone:** Comment on the narrative style, tone, and perspective used in this chapter, including any shifts or unique stylistic choices.
11. **Cultural References:** If applicable, include any cultural references or allusions that are relevant to the chapter's context.
12. **Character Names & Titles:** Ensure all character names and titles are accurately represented, including any honorifics or specific titles used in the original text.
13. **Important Objects or Artifacts:** Note any significant objects, artifacts, or items introduced in this chapter that may have relevance to the plot or character development.
14. **Dialogue Highlights:** Include any particularly impactful or memorable lines of dialogue that encapsulate character emotions or plot points, but ensure they are not the main focus of the summary.

**Overall Requirements:**
* The summary must be thorough, capturing the essential substance and depth of the chapter, rather than just a minimal outline.
* Ensure accuracy and rely *only* on information explicitly present within the provided chapter text.
* Maintain clarity and readability for someone needing to understand the chapter's core content.`,

  analyze: `Please provide a detailed analysis of this novel chapter covering:

1. **Character Development:** Analyze how characters evolve, their motivations, internal conflicts, and growth throughout the chapter.
2. **Plot Structure:** Examine the pacing, story progression, turning points, and how this chapter fits into the larger narrative arc.
3. **Writing Style:** Evaluate the prose quality, dialogue effectiveness, narrative voice, and literary techniques used.
4. **Themes & Symbolism:** Identify underlying themes, symbolic elements, and their significance to the story.
5. **World Building:** Assess how the setting, magic systems, social structures, or fictional elements are developed.
6. **Strengths & Areas for Improvement:** Highlight what works well and suggest potential enhancements.
7. **Reader Engagement:** Evaluate how effectively the chapter maintains reader interest and emotional investment.

Provide specific examples from the text to support your analysis.`,

  suggestions: `Based on this novel chapter, please provide specific improvement suggestions in these areas:

1. **Plot Development:** Ways to strengthen narrative tension, pacing, or story progression
2. **Character Enhancement:** Suggestions for deeper characterization, better dialogue, or character consistency
3. **Writing Quality:** Improvements for prose style, sentence structure, or narrative flow
4. **World Building:** Ideas to enrich the setting, magic systems, or fictional elements
5. **Dialogue:** Ways to make conversations more natural, impactful, or character-specific
6. **Descriptions:** Enhancements for scene setting, action sequences, or sensory details
7. **Emotional Impact:** Methods to increase reader engagement and emotional resonance

Provide actionable, specific suggestions with examples where possible.`,

  permanent:
    "Ensure the output is formatted using only HTML paragraph tags (<p>) for each paragraph. Handle dialogue formatting with appropriate punctuation and paragraph breaks. Do not use markdown formatting in your response.",
} as const;

// News-specific prompts
export const NEWS_PROMPTS = {
  enhance: `Please enhance this news article with the following improvements:

1. Improve clarity, readability, and journalistic flow
2. Fix grammatical errors and enhance sentence structure
3. Ensure factual accuracy and proper sourcing attribution
4. Maintain objectivity and journalistic integrity
5. Improve headline and lead paragraph effectiveness
6. Enhance transitions between paragraphs and sections
7. Ensure proper quotes and attribution formatting
8. Remove any bias or sensationalism while maintaining engagement
9. Verify that the inverted pyramid structure is followed
10. Preserve all factual information and original meaning

Keep the journalistic tone professional and informative.`,

  summarize: `Create a concise summary of this news article covering:

1. **Main Story:** The primary news event or development
2. **Key Facts:** Who, what, when, where, why, and how
3. **Important Quotes:** Significant statements from key figures
4. **Impact & Implications:** Broader consequences or significance
5. **Background Context:** Relevant historical or contextual information
6. **Current Status:** Latest developments or ongoing situations

Maintain journalistic objectivity and accuracy.`,

  analyze: `Analyze this news article for:

1. **Factual Accuracy:** Verification of claims and sources
2. **Bias Assessment:** Any potential bias or slant in reporting
3. **Source Quality:** Credibility and diversity of sources cited
4. **Completeness:** Whether all important aspects are covered
5. **Writing Quality:** Clarity, structure, and professional standards
6. **Impact Assessment:** Significance and broader implications

Provide objective analysis based on journalistic standards.`,

  suggestions: `Suggest improvements for this news article in:

1. **Content Structure:** Better organization and flow
2. **Source Diversity:** Additional perspectives or sources needed
3. **Fact-Checking:** Areas requiring verification or clarification
4. **Readability:** Ways to improve clarity and accessibility
5. **Completeness:** Missing information or perspectives
6. **Professional Standards:** Adherence to journalistic ethics

Focus on actionable improvements for professional journalism.`,

  permanent:
    "Ensure the output is formatted using only HTML paragraph tags (<p>) for each paragraph. Handle dialogue formatting with appropriate punctuation and paragraph breaks. Do not use markdown formatting in your response.",
} as const;

// Learning-specific prompts
export const LEARNING_PROMPTS = {
  enhance: `Please enhance this educational content with the following improvements:

1. Improve clarity and pedagogical structure
2. Fix grammatical errors and enhance readability
3. Ensure accurate information and proper citations
4. Add clear learning objectives and key takeaways
5. Improve explanations with examples and analogies
6. Structure content with logical progression
7. Add relevant context and background information
8. Ensure accessibility for the target learning level
9. Remove jargon or explain technical terms clearly
10. Maintain educational value and accuracy

Keep the tone engaging and educational.`,

  summarize: `Create a comprehensive summary of this educational content covering:

1. **Main Concepts:** Core ideas and learning objectives
2. **Key Facts:** Important information and data points
3. **Examples:** Relevant examples and case studies mentioned
4. **Processes:** Step-by-step procedures or methodologies
5. **Context:** Background information and relevance
6. **Applications:** Practical uses and real-world applications

Maintain educational clarity and accuracy.`,

  analyze: `Analyze this educational content for:

1. **Content Accuracy:** Verification of facts and information
2. **Pedagogical Effectiveness:** Teaching quality and clarity
3. **Learning Objectives:** Clear goals and outcomes
4. **Structure:** Logical organization and flow
5. **Accessibility:** Appropriate level for target audience
6. **Engagement:** Methods to maintain learner interest

Provide constructive feedback for educational improvement.`,

  suggestions: `Suggest improvements for this educational content in:

1. **Content Organization:** Better structure and sequencing
2. **Clarity:** Simpler explanations and clearer language
3. **Examples:** Additional or better illustrative examples
4. **Engagement:** Methods to increase learner participation
5. **Assessment:** Ways to test understanding
6. **Resources:** Additional materials or references

Focus on actionable improvements for better learning outcomes.`,

  permanent:
    "Ensure the output is formatted using only HTML paragraph tags (<p>) for each paragraph. Handle educational formatting with appropriate structure and paragraph breaks. Do not use markdown formatting in your response.",
} as const;

// Technical-specific prompts
export const TECHNICAL_PROMPTS = {
  enhance: `Please enhance this technical documentation with the following improvements:

1. Improve technical accuracy and precision
2. Fix code syntax, errors, and formatting issues
3. Ensure proper documentation standards
4. Add clear explanations of technical concepts
5. Improve code comments and documentation
6. Structure content with logical progression
7. Add usage examples and best practices
8. Ensure consistency in terminology and style
9. Remove outdated or incorrect information
10. Maintain technical depth while improving clarity

Keep the tone professional and technically accurate.`,

  summarize: `Create a technical summary covering:

1. **Main Purpose:** Primary function and objectives
2. **Key Features:** Important capabilities and functionality
3. **Technical Details:** Architecture and implementation notes
4. **Usage:** How to use or implement the content
5. **Requirements:** Dependencies and prerequisites
6. **Examples:** Code samples and demonstrations

Maintain technical accuracy and completeness.`,

  analyze: `Analyze this technical content for:

1. **Technical Accuracy:** Correctness of information and code
2. **Documentation Quality:** Completeness and clarity
3. **Code Quality:** Best practices and standards
4. **Architecture:** Design patterns and structure
5. **Maintainability:** Long-term sustainability
6. **Performance:** Efficiency considerations

Provide technical feedback and recommendations.`,

  suggestions: `Suggest improvements for this technical content in:

1. **Code Quality:** Better practices and optimization
2. **Documentation:** More comprehensive explanations
3. **Architecture:** Improved design patterns
4. **Error Handling:** Better exception management
5. **Testing:** Additional test coverage
6. **Performance:** Optimization opportunities

Focus on actionable technical improvements.`,

  permanent:
    "Ensure the output is formatted using only HTML paragraph tags (<p>) for each paragraph and proper code formatting with <code> or <pre> tags where appropriate. Do not use markdown formatting in your response.",
} as const;

// Article-specific prompts (general articles)
export const ARTICLE_PROMPTS = {
  enhance: `Please enhance this article with the following improvements:

1. Improve overall readability and flow
2. Fix grammatical errors and enhance sentence structure
3. Ensure factual accuracy and proper attribution
4. Strengthen the introduction and conclusion
5. Improve paragraph transitions and coherence
6. Enhance clarity while maintaining the author's voice
7. Remove redundancy and improve conciseness
8. Ensure proper formatting and structure
9. Add engaging elements while maintaining substance
10. Preserve the original intent and message

Keep the tone appropriate for the article's intended audience.`,

  summarize: `Create a summary of this article covering:

1. **Main Topic:** The central subject or theme
2. **Key Points:** Important arguments or information
3. **Supporting Evidence:** Facts, examples, and data
4. **Author's Perspective:** Main viewpoint or stance
5. **Conclusions:** Final thoughts or recommendations
6. **Implications:** Broader significance or impact

Maintain objectivity and accuracy in the summary.`,

  analyze: `Analyze this article for:

1. **Content Quality:** Depth and accuracy of information
2. **Writing Style:** Effectiveness of prose and structure
3. **Argument Strength:** Logic and supporting evidence
4. **Audience Appropriateness:** Suitability for intended readers
5. **Engagement:** Ability to maintain reader interest
6. **Credibility:** Source quality and reliability

Provide balanced analysis and feedback.`,

  suggestions: `Suggest improvements for this article in:

1. **Content Development:** Areas needing more depth
2. **Structure:** Better organization and flow
3. **Writing Style:** Enhanced clarity and engagement
4. **Evidence:** Stronger supporting materials
5. **Audience:** Better targeting of intended readers
6. **Impact:** Ways to increase effectiveness

Focus on constructive improvements for better articles.`,

  permanent:
    "Ensure the output is formatted using only HTML paragraph tags (<p>) for each paragraph. Handle dialogue and quotes formatting with appropriate punctuation and paragraph breaks. Do not use markdown formatting in your response.",
} as const;

// Prompt mapping by content type
export const CONTENT_TYPE_PROMPTS = {
  novel: NOVEL_PROMPTS,
  news: NEWS_PROMPTS,
  learning: LEARNING_PROMPTS,
  technical: TECHNICAL_PROMPTS,
  article: ARTICLE_PROMPTS,
} as const;

// Model recommendations by content type
export const CONTENT_TYPE_MODEL_RECOMMENDATIONS = {
  novel: {
    enhance: ["gemini-1.5-pro", "gemini-1.5-flash"],
    analyze: ["gemini-1.5-pro", "gemini-1.5-flash"],
    summarize: ["gemini-1.5-flash", "gemini-1.5-flash-8b"],
    suggestions: ["gemini-1.5-pro", "gemini-1.5-flash"],
  },
  news: {
    enhance: ["gemini-1.5-flash", "gemini-1.5-pro"],
    analyze: ["gemini-1.5-pro", "gemini-1.5-flash"],
    summarize: ["gemini-1.5-flash", "gemini-1.5-flash-8b"],
    suggestions: ["gemini-1.5-flash", "gemini-1.5-pro"],
  },
  learning: {
    enhance: ["gemini-1.5-pro", "gemini-1.5-flash"],
    analyze: ["gemini-1.5-pro", "gemini-1.5-flash"],
    summarize: ["gemini-1.5-flash", "gemini-1.5-flash-8b"],
    suggestions: ["gemini-1.5-pro", "gemini-1.5-flash"],
  },
  technical: {
    enhance: ["gemini-1.5-pro", "gemini-1.5-flash"],
    analyze: ["gemini-1.5-pro", "gemini-1.5-flash"],
    summarize: ["gemini-1.5-flash", "gemini-1.5-flash-8b"],
    suggestions: ["gemini-1.5-pro", "gemini-1.5-flash"],
  },
  article: {
    enhance: ["gemini-1.5-flash", "gemini-1.5-pro"],
    analyze: ["gemini-1.5-pro", "gemini-1.5-flash"],
    summarize: ["gemini-1.5-flash", "gemini-1.5-flash-8b"],
    suggestions: ["gemini-1.5-flash", "gemini-1.5-pro"],
  },
} as const;
