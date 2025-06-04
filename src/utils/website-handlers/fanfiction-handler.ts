import { BaseWebsiteHandler } from "./BaseWebsiteHandler";

export class FanfictionHandler extends BaseWebsiteHandler {
  override extractTitle() {
    // Fallback to the default title extraction (page title)
    return document.title;
  }
  // Get chapter navigation info (previous, next, current chapter number)
  override getChapterNavigation() {
    try {
      // Try to find chapter navigation
      const selectBox = document.getElementById(
        "chap_select"
      ) as HTMLSelectElement;
      if (selectBox) {
        const options = selectBox.querySelectorAll("option");
        const selectedIndex = selectBox.selectedIndex;

        return {
          hasPrevious: selectedIndex > 0,
          hasNext: selectedIndex < options.length - 1,
          currentChapter: selectedIndex + 1,
          totalChapters: options.length,
        };
      }
    } catch (error) {
      console.error("Error getting chapter navigation:", error);
    }

    // Fallback to default
    return super.getChapterNavigation();
  }

  // Format content after enhancement
  override formatAfterEnhancement(contentArea: HTMLElement) {
    super.formatAfterEnhancement(contentArea);

    // Add FanFiction.net specific formatting
    contentArea.style.fontFamily = "Verdana, Arial, sans-serif";
    contentArea.style.fontSize = "14px";
    contentArea.style.lineHeight = "1.6";
  }

  /**
   * Find content area specific to FanFiction.net
   */
  override findContentArea(): HTMLElement | null {
    // FanFiction.net specific selectors
    const ffnSelectors = [
      "#storytext",
      ".storytext",
      "#story_container .story_text",
      ".story_text",
    ];

    for (const selector of ffnSelectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        return element;
      }
    }

    // Fallback to base method
    return super.findContentArea();
  }
}
