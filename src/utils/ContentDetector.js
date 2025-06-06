/**
 * Utility for detecting content types
 */

// Keywords for different content types
const NOVEL_KEYWORDS = [
  "chapter",
  "novel",
  "story",
  "fiction",
  "book",
  "character",
  "plot",
];
const NEWS_KEYWORDS = [
  "news",
  "article",
  "report",
  "journalist",
  "breaking",
  "press",
];
const LEARNING_KEYWORDS = [
  "learn",
  "course",
  "education",
  "tutorial",
  "guide",
  "lesson",
];

/**
 * Detect the type of content based on text analysis
 * @param {string} text - The content to analyze
 * @returns {string} - The detected content type: 'novels', 'news', 'learning', or 'general'
 */
export const detectContentType = (text) => {
  if (!text) return "general";

  // Convert to lowercase for easier matching
  const lowerText = text.toLowerCase();

  // Count keyword occurrences
  let novelScore = 0;
  let newsScore = 0;
  let learningScore = 0;

  // Check novel keywords
  NOVEL_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      novelScore += 1;
    }
  });

  // Check news keywords
  NEWS_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      newsScore += 1;
    }
  });

  // Check learning keywords
  LEARNING_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      learningScore += 1;
    }
  });

  // Determine content type based on highest score
  if (novelScore > newsScore && novelScore > learningScore) {
    return "novels";
  } else if (newsScore > novelScore && newsScore > learningScore) {
    return "news";
  } else if (learningScore > novelScore && learningScore > newsScore) {
    return "learning";
  } else {
    return "general";
  }
};

/**
 * Detect the website type based on URL and page structure
 * @param {string} url - The URL to analyze
 * @returns {Object} - Website info object
 */
export const detectWebsite = (url) => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");

    // Predefined popular sites
    const novelSites = [
      "royalroad.com",
      "wuxiaworld.com",
      "webnovel.com",
      "scribblehub.com",
      "novelupdates.com",
      "fanfiction.net",
      "archiveofourown.org",
    ];

    const newsSites = [
      "cnn.com",
      "bbc.com",
      "nytimes.com",
      "reuters.com",
      "apnews.com",
      "washingtonpost.com",
      "theguardian.com",
      "huffpost.com",
    ];

    const learningSites = [
      "coursera.org",
      "udemy.com",
      "khanacademy.org",
      "edx.org",
      "w3schools.com",
      "stackoverflow.com",
      "medium.com",
      "dev.to",
    ];

    // Check against predefined sites
    if (novelSites.some((site) => domain.includes(site))) {
      return { site: domain, category: "novels", domain };
    } else if (newsSites.some((site) => domain.includes(site))) {
      return { site: domain, category: "news", domain };
    } else if (learningSites.some((site) => domain.includes(site))) {
      return { site: domain, category: "learning", domain };
    }

    // Default to general
    return { site: domain, category: "general", domain };
  } catch (error) {
    console.error("Error detecting website:", error);
    return { site: "unknown", category: "general", domain: "unknown" };
  }
};

export default {
  detectContentType,
  detectWebsite,
};
