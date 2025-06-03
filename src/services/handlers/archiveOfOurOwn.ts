import type { SiteHandler } from "../../types";

export const archiveOfOurOwnHandler: SiteHandler = {
  name: "Archive of Our Own",
  domains: ["archiveofourown.org", "ao3.org"],
  selectors: {
    title: ".title.heading",
    content: ".userstuff.module",
    author: '.byline.heading a[rel="author"]',
    chapter: ".title.heading",
    next: '.navigation.actions a[title="Next Chapter"]',
    previous: '.navigation.actions a[title="Previous Chapter"]',
  },
  isEnabled: true,
  priority: 1,
};
