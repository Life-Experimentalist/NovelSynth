/**
 * Constants for NovelSynth
 * Centralized configuration values and prompts used throughout the extension
 */

// Content modes
export const CONTENT_MODES = {
  NOVEL: "novel",
  NEWS: "news",
  LEARNING: "learning",
  TECHNICAL: "technical",
};

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
};

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
};

// Novel-specific prompts (from your reference constants.js)
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
};

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
};

// Learning-specific prompts
export const LEARNING_PROMPTS = {
  enhance: `Please enhance this educational content with the following improvements:

1. Improve clarity and pedagogical effectiveness
2. Fix grammatical errors and enhance readability
3. Strengthen logical flow and concept progression
4. Add better transitions between topics and sections
5. Ensure concepts are explained clearly and accurately
6. Improve examples and practical applications
7. Enhance formatting for better learning experience
8. Maintain educational value and accuracy
9. Add proper headings and structure for easy navigation
10. Remove any confusing or misleading information

Keep the educational tone informative and accessible.`,

  summarize: `Create a comprehensive summary of this educational content covering:

1. **Main Concepts:** Key ideas and principles presented
2. **Learning Objectives:** What students should understand or achieve
3. **Important Definitions:** Essential terms and their meanings
4. **Examples & Applications:** Practical uses and demonstrations
5. **Prerequisites:** Background knowledge needed
6. **Key Takeaways:** Most important points to remember

Structure the summary for effective learning and review.`,

  analyze: `Analyze this educational content for:

1. **Pedagogical Effectiveness:** How well it teaches the subject
2. **Content Accuracy:** Correctness of information presented
3. **Clarity & Accessibility:** How understandable it is for learners
4. **Structure & Organization:** Logical flow and presentation
5. **Engagement Level:** How well it maintains student interest
6. **Completeness:** Whether all necessary topics are covered

Evaluate from an educational perspective.`,

  suggestions: `Suggest improvements for this educational content in:

1. **Teaching Methods:** Better ways to explain concepts
2. **Content Organization:** Improved structure and flow
3. **Examples & Exercises:** More effective learning activities
4. **Accessibility:** Ways to make content more understandable
5. **Engagement:** Methods to increase student interest
6. **Assessment:** Ways to test understanding

Focus on pedagogically sound improvements.`,
};

// Technical documentation prompts
export const TECHNICAL_PROMPTS = {
  enhance: `Please enhance this technical documentation with the following improvements:

1. Improve technical accuracy and precision
2. Fix grammatical errors and enhance clarity
3. Ensure proper technical terminology usage
4. Improve code examples and formatting
5. Enhance step-by-step instructions
6. Add better section organization and navigation
7. Ensure consistency in style and formatting
8. Improve readability for technical audiences
9. Add proper headings and cross-references
10. Maintain technical accuracy and completeness

Keep the technical tone professional and precise.`,

  summarize: `Create a technical summary covering:

1. **Purpose & Overview:** What the document covers
2. **Key Features:** Main functionalities or concepts
3. **Requirements:** Prerequisites and dependencies
4. **Main Procedures:** Important processes or workflows
5. **Configuration:** Essential settings or parameters
6. **Troubleshooting:** Common issues and solutions

Structure for technical reference and quick access.`,

  analyze: `Analyze this technical documentation for:

1. **Technical Accuracy:** Correctness of information and procedures
2. **Completeness:** Whether all necessary information is included
3. **Clarity:** How understandable it is for the target audience
4. **Organization:** Logical structure and easy navigation
5. **Usability:** How effectively users can follow instructions
6. **Maintenance:** How well it can be updated and maintained

Evaluate from a technical documentation perspective.`,

  suggestions: `Suggest improvements for this technical documentation in:

1. **Structure & Navigation:** Better organization and findability
2. **Code Examples:** More effective and accurate examples
3. **Instructions:** Clearer step-by-step procedures
4. **Cross-References:** Better linking and references
5. **Visual Aids:** Diagrams, screenshots, or illustrations needed
6. **User Experience:** Ways to improve usability

Focus on practical technical documentation improvements.`,
};

// Combine all prompts by category
export const PROMPTS_BY_CATEGORY = {
  novel: NOVEL_PROMPTS,
  news: NEWS_PROMPTS,
  learning: LEARNING_PROMPTS,
  technical: TECHNICAL_PROMPTS,
};

// Default chunk size for large content (characters per segment)
export const DEFAULT_CHUNK_SIZE = 12000;

// Default rate limit wait time (in milliseconds)
export const RATE_LIMIT_WAIT_TIME = 300000; // 5 minutes

// Emotion emoji mapping for enhancing text with emotional indicators
export const EMOTION_EMOJIS = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  confused: "😕",
  surprised: "😲",
  shocked: "😱",
  crying: "😭",
  laugh: "😄",
  laughing: "😄",
  smile: "🙂",
  smiling: "😊",
  grin: "😁",
  sigh: "😔",
  worried: "😟",
  nervous: "😰",
  fear: "😨",
  scared: "😨",
  excited: "😃",
  bored: "😒",
  tired: "😴",
  sleepy: "😪",
  annoyed: "😤",
  frustrated: "😤",
  calm: "😌",
  relief: "😌",
  wink: "😉",
  love: "❤️",
  heart: "❤️",
  thinking: "🤔",
  thoughtful: "🤔",
  suspicious: "🤨",
  proud: "😌",
  embarrassed: "😳",
  blush: "😊",
  blushing: "😊",
  shy: "😳",
  confident: "😎",
  cool: "😎",
  serious: "😐",
  neutral: "😐",
  meh: "😒",
  satisfied: "😌",
  pleased: "😌",
  disappointed: "😞",
  regretful: "😔",
  hopeful: "🙏",
  praying: "🙏",
  determined: "😤",
  mad: "😡",
  furious: "🤬",
  rage: "😡",
  eyeroll: "🙄",
  teasing: "😏",
  smirk: "😏",
  sneer: "😏",
  contempt: "😒",
  disgust: "🤢",
  distaste: "😖",
  chuckle: "😏",
  giggle: "🤭",
  ecstatic: "😆",
  joyful: "😄",
  cheerful: "😄",
  depressed: "😞",
  upset: "😢",
  hurt: "😢",
  doubtful: "🤔",
  uncertain: "😕",
  puzzled: "🤔",
  anxious: "😰",
  terrified: "😱",
  horrified: "😱",
  trembling: "😨",
  shaking: "😨",
};

// Library storage structure
export const LIBRARY_STRUCTURE = {
  novel: {
    maxDepth: 3,
    levels: ["website", "title", "chapter"],
    examples: {
      "fanfiction.net": {
        "Harry Potter and the Methods of Rationality": [
          "Chapter 1",
          "Chapter 2",
        ],
        "The Waves Arisen": ["Chapter 1", "Chapter 2"],
      },
    },
  },
  news: {
    maxDepth: 2,
    levels: ["source", "article"],
    examples: {
      "bbc.com": ["Article 1", "Article 2"],
      "cnn.com": ["Article 1", "Article 2"],
    },
  },
  learning: {
    maxDepth: 2,
    levels: ["subject", "topic"],
    examples: {
      mathematics: ["Linear Algebra", "Calculus"],
      programming: ["JavaScript", "Python"],
    },
  },
  technical: {
    maxDepth: 2,
    levels: ["technology", "document"],
    examples: {
      react: ["Getting Started", "Hooks Guide"],
      nodejs: ["Installation", "API Reference"],
    },
  },
};
