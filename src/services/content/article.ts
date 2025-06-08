import { BaseContentHandler } from "./base";
import type { ContentMode, ExtractedContent } from "@/types";

export class ArticleContentHandler extends BaseContentHandler {
  id = "article";
  name = "Article Sites";
  domains = ["medium.com", "dev.to", "stackoverflow.com"];

  detectContentType(): ContentMode {
    const url = window.location.href;

    if (url.includes("stackoverflow.com")) {
      return "code";
    }

    return "article";
  }

  extractContent(): ExtractedContent {
    const url = window.location.href;
    let content = "";
    let title = "";

    // Medium
    if (url.includes("medium.com")) {
      title =
        document.querySelector("h1")?.textContent ||
        document.querySelector('[data-testid="storyTitle"]')?.textContent ||
        document.title;
      content = Array.from(
        document.querySelectorAll(
          "article p, article h1, article h2, article h3"
        )
      )
        .map((el) => el.textContent)
        .join("\n\n");
    }

    // Dev.to
    else if (url.includes("dev.to")) {
      title =
        document.querySelector("#article-body h1")?.textContent ||
        document.querySelector("h1")?.textContent ||
        document.title;
      content = document.querySelector("#article-body")?.textContent || "";
    }

    // Stack Overflow
    else if (url.includes("stackoverflow.com")) {
      title =
        document.querySelector("h1 a")?.textContent ||
        document.querySelector("h1")?.textContent ||
        document.title;

      const question =
        document.querySelector(".s-prose.js-post-body")?.textContent || "";
      const answers = Array.from(document.querySelectorAll(".answer .s-prose"))
        .map((el) => el.textContent)
        .join("\n\n---\n\n");

      content = `Question:\n${question}\n\nAnswers:\n${answers}`;
    }

    return {
      title: this.cleanText(title),
      content: this.cleanText(content),
      contentType: this.detectContentType(),
      metadata: {
        url: window.location.href,
        domain: window.location.hostname,
      },
    };
  }
}
