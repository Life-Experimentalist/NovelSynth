import type { SiteHandler } from "../../types";

export const mediumHandler: SiteHandler = {
  name: "Medium",
  domains: [
    "medium.com",
    "towardsdatascience.com",
    "javascript.plainenglish.io",
  ],
  selectors: {
    title: 'h1[data-testid="storyTitle"]',
    content: "article section",
    author: '[data-testid="authorName"]',
    chapter: 'h1[data-testid="storyTitle"]',
    next: ".next-story",
    previous: ".prev-story",
  },
  isEnabled: true,
  priority: 1,
};
