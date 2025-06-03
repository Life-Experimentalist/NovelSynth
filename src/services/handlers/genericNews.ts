import type { SiteHandler } from "../../types";

export const genericNewsHandler: SiteHandler = {
  name: "Generic News",
  domains: [
    "cnn.com",
    "bbc.com",
    "reuters.com",
    "news.ycombinator.com",
    "techcrunch.com",
    "theverge.com",
  ],
  selectors: {
    title: "h1, .headline, .article-title",
    content: ".article-content, .story-body, .post-content, article",
    author: ".byline, .author, .article-author",
    chapter: "h1, .headline",
    next: ".next-article, .pagination-next",
    previous: ".prev-article, .pagination-prev",
  },
  isEnabled: true,
  priority: 0,
};
