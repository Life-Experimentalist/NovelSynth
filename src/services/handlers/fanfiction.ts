import type { SiteHandler } from "../../types";

export const fanfictionHandler: SiteHandler = {
  name: "FanFiction.Net",
  domains: ["fanfiction.net", "www.fanfiction.net", "m.fanfiction.net"],
  selectors: {
    title: ".storytitle",
    content: "#storytext",
    author: ".xcontrast_txt",
    chapter: ".storytitle",
    next: '[title="Next Chapter"]',
    previous: '[title="Previous Chapter"]',
  },
  isEnabled: true,
  priority: 1,
};
