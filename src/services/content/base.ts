import type { ContentHandler, ContentMode, ExtractedContent } from "@/types";

export abstract class BaseContentHandler implements ContentHandler {
  abstract id: string;
  abstract name: string;
  abstract domains: string[];

  abstract detectContentType(): ContentMode;
  abstract extractContent(): ExtractedContent;

  canHandle(url: string): boolean {
    return this.domains.some((domain) => {
      const pattern = domain.replace(/\*/g, ".*");
      return new RegExp(pattern).test(url);
    });
  }

  protected cleanText(text: string): string {
    return text
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();
  }

  protected getMetaContent(property: string): string | null {
    const meta = document.querySelector(
      `meta[property="${property}"], meta[name="${property}"]`
    );
    return meta?.getAttribute("content") || null;
  }
}
