// Top button injection system for NovelSynth
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { TopButtonPanel } from "../components/features/TopButtonPanel";
import { ExtensionProvider } from "../contexts/ExtensionContext";

export interface TopButtonInjector {
  inject(): void;
  destroy(): void;
  updateRecent(featureIds: string[]): void;
}

class TopButtonInjectorImpl implements TopButtonInjector {
  private container: HTMLElement | null = null;
  private root: any = null;
  private queryClient: QueryClient;
  private recentFeatures: string[] = [];

  constructor() {
    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  inject(): void {
    // Don't inject if already exists
    if (this.container && document.body.contains(this.container)) {
      return;
    }

    // Find the best position to inject buttons
    const targetElement = this.findContentTarget();
    if (!targetElement) {
      console.log("NovelSynth: No suitable target found for top buttons");
      return;
    }

    // Create container
    this.container = document.createElement("div");
    this.container.id = "novelsynth-top-buttons";
    this.container.style.cssText = `
      margin: 16px 0;
      z-index: 1000;
      position: relative;
    `;

    // Insert at the top of content
    targetElement.insertBefore(this.container, targetElement.firstChild);

    // Create React root and render
    this.root = createRoot(this.container);
    this.renderButtons();

    console.log("NovelSynth: Top buttons injected successfully");
  }

  destroy(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }

  updateRecent(featureIds: string[]): void {
    this.recentFeatures = featureIds;
    if (this.root) {
      this.renderButtons();
    }
  }

  private renderButtons(): void {
    if (!this.root) return;

    const antdTheme = {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: "#1890ff",
        borderRadius: 6,
        fontSize: 14,
      },
    };

    this.root.render(
      <QueryClientProvider client={this.queryClient}>
        <ConfigProvider theme={antdTheme}>
          <ExtensionProvider>
            <TopButtonPanel recentFeatures={this.recentFeatures} />
          </ExtensionProvider>
        </ConfigProvider>
      </QueryClientProvider>
    );
  }

  private findContentTarget(): HTMLElement | null {
    // Priority list of content selectors
    const contentSelectors = [
      // Story/fiction sites
      "#storytext", // FanFiction.Net
      ".userstuff", // Archive of Our Own
      ".chapter-content", // Royal Road
      "[data-testid='story-part-content']", // Wattpad
      ".story-text",
      ".chapter-text",

      // General content sites
      "article",
      "main",
      ".post-content",
      ".entry-content",
      ".content",
      "#content",
      "[role='main']",

      // Fallback to any large text container
      "div:has(> p:nth-child(3))", // Div with at least 3 paragraphs
    ];

    for (const selector of contentSelectors) {
      try {
        const element = document.querySelector(selector) as HTMLElement;
        if (element && this.isValidContentTarget(element)) {
          return element;
        }
      } catch (e) {
        // Skip invalid selectors
        continue;
      }
    }

    return null;
  }

  private isValidContentTarget(element: HTMLElement): boolean {
    if (!element || !element.textContent) return false;

    // Check text content length
    const textContent = element.textContent.trim();
    if (textContent.length < 500) return false;

    // Check if element is visible
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return false;

    // Check if element has reasonable size
    const rect = element.getBoundingClientRect();
    if (rect.width < 200 || rect.height < 100) return false;

    return true;
  }
}

// Export singleton instance
export const topButtonInjector = new TopButtonInjectorImpl();
