import { BaseContentHandler } from "./base";
import type { ContentMode, ExtractedContent } from "@/types";

export class NovelContentHandler extends BaseContentHandler {
  id = "novel";
  name = "Novel Sites";
  domains = [
    "fanfiction.net",
    "www.fanfiction.net",
    "m.fanfiction.net",
    "archiveofourown.org",
    "royalroad.com",
    "www.royalroad.com",
    "webnovel.com",
    "www.webnovel.com",
    "wattpad.com",
    "www.wattpad.com",
  ];

  detectContentType(): ContentMode {
    return "novel";
  }

  extractContent(): ExtractedContent {
    const url = window.location.href;
    let content = "";
    let title = "";

    // FanFiction.Net
    if (url.includes("fanfiction.net")) {
      title =
        document.querySelector("b.xcontrast_txt")?.textContent ||
        document.querySelector("#profile_top b")?.textContent ||
        document.title;
      content = document.querySelector("#storytext")?.textContent || "";
    }

    // Archive of Our Own
    else if (url.includes("archiveofourown.org")) {
      title =
        document.querySelector("h2.title")?.textContent ||
        document.querySelector(".preface h2")?.textContent ||
        document.title;
      content =
        document.querySelector("#chapters .userstuff")?.textContent ||
        document.querySelector('.userstuff[role="article"]')?.textContent ||
        "";
    }

    // Royal Road
    else if (url.includes("royalroad.com")) {
      title =
        document.querySelector(".fic-title h1")?.textContent ||
        document.querySelector("h1")?.textContent ||
        document.title;
      content = document.querySelector(".chapter-content")?.textContent || "";
    }

    // WebNovel
    else if (url.includes("webnovel.com")) {
      title =
        document.querySelector(".cha-tit")?.textContent ||
        document.querySelector("h1")?.textContent ||
        document.title;
      content =
        document.querySelector(".cha-words")?.textContent ||
        document.querySelector(".chapter-content")?.textContent ||
        "";
    }

    // Wattpad
    else if (url.includes("wattpad.com")) {
      title = document.querySelector("h1")?.textContent || document.title;
      content =
        document.querySelector('[data-field="text"]')?.textContent || "";
    }

    return {
      title: this.cleanText(title),
      content: this.cleanText(content),
      contentType: "novel",
      metadata: {
        url: window.location.href,
        domain: window.location.hostname,
      },
    };
  }
}
