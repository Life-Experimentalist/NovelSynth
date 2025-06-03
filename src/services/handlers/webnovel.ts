import type { SiteHandler } from "../../types";

export const webnovelHandler: SiteHandler = {
  name: "WebNovel.com",
  domains: ["webnovel.com", "www.webnovel.com"],
  selectors: {
    title: ".det-hd h1",
    content: ".cha-content .cha-words",
    author: ".det-hd .author",
    chapter: ".cha-tit",
    next: ".cha-nav .j_next_chapter",
    previous: ".cha-nav .j_pre_chapter",
  },
  isEnabled: true,
  priority: 1,
};
