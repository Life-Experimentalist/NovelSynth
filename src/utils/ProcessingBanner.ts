import { WordCounter, WordCountStats } from "../utils/WordCounter";

export interface BannerConfig {
  provider: string;
  model: string;
  showWordCount: boolean;
  showProcessingBanner: boolean;
}

export class ProcessingBanner {
  private bannerElement: HTMLElement | null = null;
  private config: BannerConfig;

  constructor(config: BannerConfig) {
    this.config = config;
  }

  /**
   * Create and show initial banner with word count
   */
  showInitialBanner(contentElement: Element, wordCount: number): void {
    if (!this.config.showProcessingBanner) {
      return;
    }

    this.removeBanner();

    const banner = this.createBannerElement();
    const readingTime = WordCounter.getReadingTime(wordCount);

    banner.innerHTML = `
      <div class="novelsynth-banner-content">
        <div class="novelsynth-banner-header">
          <span class="novelsynth-banner-title">📖 NovelSynth Ready</span>
          <span class="novelsynth-banner-close" title="Close">&times;</span>
        </div>
        <div class="novelsynth-banner-stats">
          <div class="stat-item">
            <span class="stat-label">Words:</span>
            <span class="stat-value">${WordCounter.formatWordCount(
              wordCount
            )}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Reading Time:</span>
            <span class="stat-value">${readingTime}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">AI Provider:</span>
            <span class="stat-value">${this.config.provider}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Model:</span>
            <span class="stat-value">${this.config.model}</span>
          </div>
        </div>
      </div>
    `;

    this.insertBanner(contentElement, banner);
    this.setupBannerEvents(banner);
  }

  /**
   * Show processing banner while AI is working
   */
  showProcessingBanner(contentElement: Element): void {
    if (!this.config.showProcessingBanner) {
      return;
    }

    this.removeBanner();

    const banner = this.createBannerElement();
    banner.classList.add("processing");

    banner.innerHTML = `
      <div class="novelsynth-banner-content">
        <div class="novelsynth-banner-header">
          <span class="novelsynth-banner-title">🤖 Enhancing Content...</span>
          <div class="novelsynth-spinner"></div>
        </div>
        <div class="novelsynth-banner-stats">
          <div class="stat-item">
            <span class="stat-label">AI Provider:</span>
            <span class="stat-value">${this.config.provider}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Model:</span>
            <span class="stat-value">${this.config.model}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Status:</span>
            <span class="stat-value processing-text">Processing...</span>
          </div>
        </div>
      </div>
    `;

    this.insertBanner(contentElement, banner);
  }

  /**
   * Show completion banner with enhancement stats
   */
  showCompletionBanner(
    contentElement: Element,
    stats: WordCountStats,
    processingTime: number
  ): void {
    if (!this.config.showProcessingBanner) {
      return;
    }

    this.removeBanner();

    const banner = this.createBannerElement();
    banner.classList.add("completed");

    const changeColor = stats.wordsChanged >= 0 ? "positive" : "negative";
    const changeIcon = stats.wordsChanged >= 0 ? "📈" : "📉";

    banner.innerHTML = `
      <div class="novelsynth-banner-content">
        <div class="novelsynth-banner-header">
          <span class="novelsynth-banner-title">✨ Enhancement Complete</span>
          <span class="novelsynth-banner-close" title="Close">&times;</span>
        </div>
        <div class="novelsynth-banner-stats">
          <div class="stat-item">
            <span class="stat-label">Original Words:</span>
            <span class="stat-value">${WordCounter.formatWordCount(
              stats.originalWords
            )}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Enhanced Words:</span>
            <span class="stat-value">${WordCounter.formatWordCount(
              stats.enhancedWords
            )}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Change:</span>
            <span class="stat-value ${changeColor}">
              ${changeIcon} ${WordCounter.formatWordChange(stats.wordsChanged)}
              (${WordCounter.formatPercentageChange(stats.percentageChange)})
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Processing Time:</span>
            <span class="stat-value">${(processingTime / 1000).toFixed(
              1
            )}s</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Provider:</span>
            <span class="stat-value">${this.config.provider} (${
      this.config.model
    })</span>
          </div>
        </div>
      </div>
    `;

    this.insertBanner(contentElement, banner);
    this.setupBannerEvents(banner);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.removeBanner();
    }, 10000);
  }

  /**
   * Show error banner
   */
  showErrorBanner(contentElement: Element, error: string): void {
    if (!this.config.showProcessingBanner) {
      return;
    }

    this.removeBanner();

    const banner = this.createBannerElement();
    banner.classList.add("error");

    banner.innerHTML = `
      <div class="novelsynth-banner-content">
        <div class="novelsynth-banner-header">
          <span class="novelsynth-banner-title">❌ Enhancement Failed</span>
          <span class="novelsynth-banner-close" title="Close">&times;</span>
        </div>
        <div class="novelsynth-banner-error">
          <p>${error}</p>
        </div>
      </div>
    `;

    this.insertBanner(contentElement, banner);
    this.setupBannerEvents(banner);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      this.removeBanner();
    }, 8000);
  }

  /**
   * Remove the current banner
   */
  removeBanner(): void {
    if (this.bannerElement) {
      this.bannerElement.remove();
      this.bannerElement = null;
    }
  }

  /**
   * Create the base banner element
   */
  private createBannerElement(): HTMLElement {
    const banner = document.createElement("div");
    banner.className = "novelsynth-processing-banner";
    banner.innerHTML = this.getBannerStyles();
    return banner;
  }

  /**
   * Insert banner into the page
   */
  private insertBanner(contentElement: Element, banner: HTMLElement): void {
    // Try to insert before content, or at the top of the page
    const insertPoint = contentElement.parentElement || document.body;
    insertPoint.insertBefore(banner, contentElement);
    this.bannerElement = banner;
  }

  /**
   * Setup banner event listeners
   */
  private setupBannerEvents(banner: HTMLElement): void {
    const closeButton = banner.querySelector(".novelsynth-banner-close");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        this.removeBanner();
      });
    }
  }

  /**
   * Get banner CSS styles
   */
  private getBannerStyles(): string {
    return `
      <style>
        .novelsynth-processing-banner {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 20px;
          margin: 16px 0;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          z-index: 10000;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .novelsynth-processing-banner.processing {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: processingPulse 2s infinite;
        }

        .novelsynth-processing-banner.completed {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .novelsynth-processing-banner.error {
          background: linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%);
        }

        @keyframes processingPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .novelsynth-banner-content {
          max-width: 100%;
        }

        .novelsynth-banner-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .novelsynth-banner-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .novelsynth-banner-close {
          cursor: pointer;
          font-size: 20px;
          font-weight: bold;
          opacity: 0.7;
          transition: opacity 0.2s;
          padding: 0 4px;
        }

        .novelsynth-banner-close:hover {
          opacity: 1;
        }

        .novelsynth-banner-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 8px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          border-radius: 6px;
          backdrop-filter: blur(10px);
        }

        .stat-label {
          font-size: 13px;
          opacity: 0.9;
          font-weight: 500;
        }

        .stat-value {
          font-size: 13px;
          font-weight: 600;
        }

        .stat-value.positive {
          color: #4ade80;
        }

        .stat-value.negative {
          color: #f87171;
        }

        .processing-text {
          animation: processingDots 1.5s infinite;
        }

        @keyframes processingDots {
          0% { content: 'Processing'; }
          33% { content: 'Processing.'; }
          66% { content: 'Processing..'; }
          100% { content: 'Processing...'; }
        }

        .novelsynth-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .novelsynth-banner-error {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 6px;
          margin-top: 8px;
        }

        .novelsynth-banner-error p {
          margin: 0;
          font-size: 14px;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .novelsynth-banner-stats {
            grid-template-columns: 1fr;
          }

          .novelsynth-processing-banner {
            margin: 8px;
            padding: 12px 16px;
          }
        }
      </style>
    `;
  }
}
