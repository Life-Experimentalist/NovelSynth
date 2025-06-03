import type { SiteHandler } from "../../types";

export const geeksForGeeksHandler: SiteHandler = {
  name: "GeeksforGeeks",
  domains: ["geeksforgeeks.org", "www.geeksforgeeks.org"],
  selectors: {
    title: ".article-title",
    content: ".content, .text, article",
    author: ".author-name",
    chapter: ".article-title",
    next: ".next-article",
    previous: ".prev-article",
  },
  isEnabled: true,
  priority: 1,
};
