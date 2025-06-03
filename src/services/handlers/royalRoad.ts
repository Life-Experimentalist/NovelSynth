import type { SiteHandler } from "../../types";

export const royalRoadHandler: SiteHandler = {
  name: "Royal Road",
  domains: ["royalroad.com", "www.royalroad.com"],
  selectors: {
    title: ".fic-title h1",
    content: ".chapter-content",
    author: ".fic-title .author",
    chapter: ".chapter-title",
    next: '.nav-buttons .btn:contains("Next Chapter")',
    previous: '.nav-buttons .btn:contains("Previous Chapter")',
  },
  isEnabled: true,
  priority: 1,
};
