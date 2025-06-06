// Website detection and content handling logic
export class WebsiteHandler {
  constructor() {
    this.websites = {
      novels: [
        {
          domain: "fanfiction.net",
          name: "FanFiction.Net",
          selector: "#storytext",
        },
        {
          domain: "royalroad.com",
          name: "Royal Road",
          selector: ".chapter-content",
        },
        {
          domain: "webnovel.com",
          name: "WebNovel",
          selector: ".chapter_content",
        },
        {
          domain: "ranobes.net",
          name: "Ranobes",
          selector: ".chapter-content",
        },
        {
          domain: "wuxiaworld.com",
          name: "Wuxia World",
          selector: ".chapter-content",
        },
        {
          domain: "scribblehub.com",
          name: "ScribbleHub",
          selector: ".chp_raw",
        },
        {
          domain: "novelupdates.com",
          name: "Novel Updates",
          selector: "#editbody",
        },
      ],
      news: [
        {
          domain: "theguardian.com",
          name: "The Guardian",
          selector: ".article-body-commercial-selector",
        },
        {
          domain: "bbc.com",
          name: "BBC News",
          selector: ".article__body-content",
        },
        { domain: "cnn.com", name: "CNN", selector: ".article__content" },
        {
          domain: "nytimes.com",
          name: "New York Times",
          selector: ".article-content",
        },
        { domain: "reuters.com", name: "Reuters", selector: ".article-body" },
        { domain: "apnews.com", name: "AP News", selector: ".Article" },
        { domain: "bloomberg.com", name: "Bloomberg", selector: ".body-copy" },
      ],
      learning: [
        {
          domain: "coursera.org",
          name: "Coursera",
          selector: ".lesson-content",
        },
        {
          domain: "udemy.com",
          name: "Udemy",
          selector: ".js-curriculum-item-content-main",
        },
        {
          domain: "khanacademy.org",
          name: "Khan Academy",
          selector: ".article-content",
        },
        { domain: "edx.org", name: "edX", selector: ".course-content" },
        { domain: "medium.com", name: "Medium", selector: "article" },
        {
          domain: "wikipedia.org",
          name: "Wikipedia",
          selector: ".mw-parser-output",
        },
        {
          domain: "stackexchange.com",
          name: "Stack Exchange",
          selector: ".post-text",
        },
      ],
    };
  }

  detectWebsite(url) {
    if (!url) {
      return {
        category: "general",
        site: "Unknown",
        domain: "unknown",
        customSelector: null,
      };
    }

    try {
      const hostname = new URL(url).hostname.replace("www.", "");

      for (const [category, sites] of Object.entries(this.websites)) {
        for (const site of sites) {
          if (hostname.includes(site.domain)) {
            return {
              category,
              site: site.name,
              domain: site.domain,
              customSelector: site.selector,
            };
          }
        }
      }

      // Try to determine if it might be a novel site by looking for common novel indicators
      if (
        url.includes("/novel/") ||
        url.includes("/chapter/") ||
        url.includes("/fiction/") ||
        url.includes("/story/")
      ) {
        return {
          category: "novels",
          site: hostname,
          domain: hostname,
          customSelector: null,
          isGuessed: true,
        };
      }

      // Try to determine if it might be a news site
      if (
        url.includes("/news/") ||
        url.includes("/article/") ||
        url.includes("/story/") ||
        hostname.includes("news") ||
        hostname.endsWith(".news")
      ) {
        return {
          category: "news",
          site: hostname,
          domain: hostname,
          customSelector: null,
          isGuessed: true,
        };
      }

      return {
        category: "general",
        site: hostname,
        domain: hostname,
        customSelector: null,
      };
    } catch (error) {
      console.error("Error parsing URL:", error);
      return {
        category: "general",
        site: "Unknown",
        domain: "unknown",
        customSelector: null,
      };
    }
  }

  getContentHandler(websiteInfo) {
    switch (websiteInfo.category) {
      case "novels":
        return new NovelContentHandler(websiteInfo.customSelector);
      case "news":
        return new NewsContentHandler(websiteInfo.customSelector);
      case "learning":
        return new LearningContentHandler(websiteInfo.customSelector);
      default:
        return new GeneralContentHandler();
    }
  }

  // Helper to extract just the domain from a URL
  getDomainFromUrl(url) {
    try {
      const hostname = new URL(url).hostname;
      const parts = hostname.split(".");
      if (parts.length > 2) {
        // Handle cases like sub.example.com
        return parts.slice(-2).join(".");
      }
      return hostname;
    } catch (error) {
      return "unknown";
    }
  }
}

// Base Content Handler class
export class ContentHandler {
  constructor(customSelector = null) {
    this.selectors = {};
    this.customSelector = customSelector;
  }

  extractContent() {
    throw new Error("Method not implemented");
  }

  getWordCount(text) {
    if (!text) return 0;
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  findFirstMatch(selectors) {
    // Try custom selector first if available
    if (this.customSelector) {
      const customElement = document.querySelector(this.customSelector);
      if (customElement) return customElement;
    }

    // Fall back to the predefined selectors
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    return null;
  }

  findReadableContent() {
    // If no specific content found, use readability algorithm to find main content

    // First try common content selectors
    const commonSelectors = [
      "article",
      "main",
      ".article",
      ".content",
      ".post-content",
      ".entry-content",
      ".article-content",
      ".post",
      "#content",
    ];

    for (const selector of commonSelectors) {
      const element = document.querySelector(selector);
      if (element && this.isReadableContent(element)) {
        return element;
      }
    }

    // If that fails, look for the element with the most text
    const elements = document.querySelectorAll("div, article, section");
    let bestElement = null;
    let maxTextLength = 0;

    elements.forEach((element) => {
      // Skip tiny elements and those with minimal content
      if (element.offsetWidth < 200 || element.offsetHeight < 200) {
        return;
      }

      const text = element.innerText;
      const textLength = text.length;

      // Prioritize elements with longer text content
      if (textLength > maxTextLength && this.isReadableContent(element)) {
        maxTextLength = textLength;
        bestElement = element;
      }
    });

    return bestElement || document.body;
  }

  isReadableContent(element) {
    if (!element) return false;

    const text = element.innerText || "";
    const wordCount = this.getWordCount(text);

    // Basic readability checks
    if (wordCount < 100) {
      return false; // Too short to be main content
    }

    // Check text-to-tag ratio (basic readability metric)
    const innerHTML = element.innerHTML || "";
    const textToTagRatio = text.length / innerHTML.length;

    if (textToTagRatio < 0.2) {
      return false; // Too many tags compared to text
    }

    // Check for common non-content indicators
    const isNavigation =
      element.tagName === "NAV" ||
      element.classList.contains("nav") ||
      element.classList.contains("menu") ||
      element.classList.contains("navigation");

    const isHeader =
      element.tagName === "HEADER" ||
      element.id === "header" ||
      element.classList.contains("header");

    const isFooter =
      element.tagName === "FOOTER" ||
      element.id === "footer" ||
      element.classList.contains("footer");

    const isSidebar =
      element.classList.contains("sidebar") ||
      element.id === "sidebar" ||
      element.classList.contains("widget");

    if (isNavigation || isHeader || isFooter || isSidebar) {
      return false;
    }

    return true;
  }
}

// Novel Content Handler
export class NovelContentHandler extends ContentHandler {
  constructor(customSelector = null) {
    super(customSelector);
    this.selectors = {
      title: [
        "h1.title",
        ".novel-title",
        ".story_title",
        "h1",
        ".fic-header h1",
      ],
      content: [
        "#chapter-content",
        ".chapter-content",
        ".chapter-text",
        ".chapter-inner",
        "#storytext",
        ".chp_raw",
      ],
      author: [".author", ".byline", ".authorlink", ".fic-author"],
      chapterTitle: [".chapter-title", ".chapter-header", "h2.heading"],
    };
  }

  extractContent() {
    const title = this.findFirstMatch(this.selectors.title);
    const content =
      this.findFirstMatch(this.selectors.content) || this.findReadableContent();
    const author = this.findFirstMatch(this.selectors.author);
    const chapterTitle = this.findFirstMatch(this.selectors.chapterTitle);

    const text = content ? content.innerText : "";

    return {
      type: "novel",
      title: title ? title.innerText.trim() : document.title,
      author: author ? author.innerText.trim() : "Unknown",
      chapterTitle: chapterTitle ? chapterTitle.innerText.trim() : "",
      text: text,
      wordCount: this.getWordCount(text),
      element: content,
    };
  }
}

// News Content Handler
export class NewsContentHandler extends ContentHandler {
  constructor(customSelector = null) {
    super(customSelector);
    this.selectors = {
      title: [
        "h1.headline",
        "h1.title",
        ".article-header h1",
        ".article-title",
        "h1",
      ],
      content: [
        "article",
        ".article-content",
        ".story-body",
        ".article-body",
        ".entry-content",
        ".story-content",
      ],
      author: [".author", ".byline", ".article-byline", ".story-meta .author"],
      publishDate: [".published-date", ".article-date", ".story-date", "time"],
    };
  }

  extractContent() {
    const title = this.findFirstMatch(this.selectors.title);
    const content =
      this.findFirstMatch(this.selectors.content) || this.findReadableContent();
    const author = this.findFirstMatch(this.selectors.author);
    const publishDate = this.findFirstMatch(this.selectors.publishDate);

    const text = content ? content.innerText : "";

    return {
      type: "news",
      title: title ? title.innerText.trim() : document.title,
      author: author ? author.innerText.trim() : "Unknown",
      publishDate: publishDate ? publishDate.innerText.trim() : "",
      text: text,
      wordCount: this.getWordCount(text),
      element: content,
    };
  }
}

// Learning Content Handler
export class LearningContentHandler extends ContentHandler {
  constructor(customSelector = null) {
    super(customSelector);
    this.selectors = {
      title: [
        "h1.course-title",
        "h1.title",
        ".lesson-title",
        ".article-header h1",
        "h1",
      ],
      content: [
        ".lesson-content",
        ".course-content",
        ".article-content",
        ".entry-content",
        "article",
      ],
      author: [".instructor", ".teacher", ".author", ".byline"],
      section: [".section-title", ".module-title", ".lesson-number"],
    };
  }

  extractContent() {
    const title = this.findFirstMatch(this.selectors.title);
    const content =
      this.findFirstMatch(this.selectors.content) || this.findReadableContent();
    const author = this.findFirstMatch(this.selectors.author);
    const section = this.findFirstMatch(this.selectors.section);

    const text = content ? content.innerText : "";

    return {
      type: "learning",
      title: title ? title.innerText.trim() : document.title,
      author: author ? author.innerText.trim() : "Unknown",
      section: section ? section.innerText.trim() : "",
      text: text,
      wordCount: this.getWordCount(text),
      element: content,
    };
  }
}

// General Content Handler
export class GeneralContentHandler extends ContentHandler {
  constructor(customSelector = null) {
    super(customSelector);
    this.selectors = {
      title: ["h1", ".title", ".page-title", "header h1"],
      content: [
        "article",
        "main",
        ".content",
        ".page-content",
        ".entry-content",
        ".post-content",
      ],
    };
  }

  extractContent() {
    const title = this.findFirstMatch(this.selectors.title);
    const content =
      this.findFirstMatch(this.selectors.content) || this.findReadableContent();

    const text = content ? content.innerText : "";

    return {
      type: "general",
      title: title ? title.innerText.trim() : document.title,
      text: text,
      wordCount: this.getWordCount(text),
      element: content,
    };
  }
}
