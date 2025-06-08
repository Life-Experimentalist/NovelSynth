/**
 * Type definitions for website content handlers
 */

/**
 * Content types that can be processed by the extension
 */
export enum ContentType {
  /** Web novels, light novels, and serialized fiction */
  NOVEL = "novel",
  /** Fan fiction and derivative works */
  FANFICTION = "fanfiction",
  /** News articles and journalism */
  NEWS = "news",
  /** Blog posts and personal articles */
  BLOG = "blog",
  /** Technical documentation */
  DOCUMENTATION = "documentation",
  /** Academic papers and research */
  ACADEMIC = "academic",
  /** General web articles */
  ARTICLE = "article",
  /** Social media posts */
  SOCIAL = "social",
  /** Forum posts and discussions */
  FORUM = "forum",
  /** Unknown or unclassified content */
  UNKNOWN = "unknown",
}

/**
 * Content quality assessment
 */
export enum ContentQuality {
  /** Professional content with good grammar and structure */
  HIGH = "high",
  /** Standard web content with minor issues */
  MEDIUM = "medium",
  /** Machine-translated or low-quality content */
  LOW = "low",
  /** Content with significant issues */
  POOR = "poor",
}

/**
 * Chapter navigation information
 */
export interface ChapterNavigation {
  /** Whether there's a previous chapter */
  hasPrevious: boolean;
  /** Whether there's a next chapter */
  hasNext: boolean;
  /** Current chapter number (1-based) */
  currentChapter: number;
  /** Total number of chapters (0 if unknown) */
  totalChapters: number;
  /** URL of previous chapter */
  previousUrl?: string;
  /** URL of next chapter */
  nextUrl?: string;
  /** Chapter selector element for navigation */
  chapterSelector?: HTMLSelectElement;
}

/**
 * Content metadata extracted from the page
 */
export interface ContentMetadata {
  /** Main title of the content */
  title: string;
  /** Author name(s) */
  author?: string;
  /** Content description or summary */
  description?: string;
  /** Publication or last update date */
  date?: Date;
  /** Content language */
  language?: string;
  /** Word count estimate */
  wordCount?: number;
  /** Reading time estimate in minutes */
  readingTime?: number;
  /** Series or story name */
  series?: string;
  /** Genre tags */
  genres?: string[];
  /** Content rating */
  rating?: string;
  /** Additional custom metadata */
  custom?: Record<string, any>;
}

/**
 * Content extraction result
 */
export interface ContentExtractionResult {
  /** Whether content was successfully found */
  found: boolean;
  /** Extracted text content */
  text: string;
  /** Content metadata */
  metadata: ContentMetadata;
  /** CSS selector used to find content */
  selector: string;
  /** Content type classification */
  contentType: ContentType;
  /** Quality assessment */
  quality: ContentQuality;
  /** Reason for failure if not found */
  reason?: string;
  /** Raw HTML content for advanced processing */
  rawHtml?: string;
}

/**
 * UI insertion point for controls
 */
export interface UIInsertionPoint {
  /** Element to insert relative to */
  element: HTMLElement;
  /** Position relative to the element */
  position: "before" | "after" | "prepend" | "append";
  /** Custom CSS class for the insertion container */
  containerClass?: string;
}

/**
 * Website-specific selectors
 */
export interface WebsiteSelectors {
  /** Content area selectors in order of preference */
  content: string[];
  /** Title selectors */
  title: string[];
  /** Author selectors */
  author?: string[];
  /** Date selectors */
  date?: string[];
  /** Navigation selectors */
  navigation?: {
    previous?: string[];
    next?: string[];
    chapterList?: string[];
  };
  /** Elements to exclude from content */
  exclude?: string[];
}

/**
 * Website handler configuration
 */
export interface WebsiteConfig {
  /** Human-readable site name */
  siteName: string;
  /** Primary domain patterns */
  domains: string[];
  /** Content type this site primarily serves */
  primaryContentType: ContentType;
  /** Expected content quality */
  expectedQuality: ContentQuality;
  /** Site-specific CSS selectors */
  selectors: WebsiteSelectors;
  /** Default prompt template for AI processing */
  defaultPrompt?: string;
  /** Site-specific styling rules */
  styles?: Record<string, string>;
  /** Features supported by this site */
  features?: {
    chapterNavigation?: boolean;
    seriesTracking?: boolean;
    authorProfiles?: boolean;
  };
}

/**
 * Content validation rules
 */
export interface ContentValidation {
  /** Minimum content length in characters */
  minLength?: number;
  /** Maximum content length in characters */
  maxLength?: number;
  /** Required elements that must be present */
  requiredElements?: string[];
  /** Forbidden elements that indicate non-content pages */
  forbiddenElements?: string[];
  /** URL patterns that indicate content pages */
  contentUrlPatterns?: RegExp[];
  /** URL patterns that indicate non-content pages */
  excludeUrlPatterns?: RegExp[];
}

/**
 * Base interface for all website handlers
 */
export interface IWebsiteHandler {
  /** Get handler configuration */
  getConfig(): WebsiteConfig;

  /** Check if this handler can process the current page */
  canHandle(url?: string): boolean;

  /** Validate that current page contains processable content */
  validateContent(): Promise<boolean>;

  /** Extract content from the current page */
  extractContent(): Promise<ContentExtractionResult>;

  /** Get chapter navigation information */
  getChapterNavigation(): Promise<ChapterNavigation>;

  /** Get optimal UI insertion point */
  getUIInsertionPoint(contentArea?: HTMLElement): UIInsertionPoint;

  /** Get site-specific prompt for AI processing */
  getSiteSpecificPrompt(): string;

  /** Apply post-enhancement formatting */
  formatAfterEnhancement(contentArea: HTMLElement): void;

  /** Clean up handler resources */
  cleanup?(): void;
}

/**
 * Handler registration entry
 */
export interface HandlerRegistration {
  /** Handler class constructor */
  handlerClass: new () => IWebsiteHandler;
  /** Priority for handler selection (higher = preferred) */
  priority: number;
  /** Whether this is enabled by default */
  enabled: boolean;
}

/**
 * Handler manager configuration
 */
export interface HandlerManagerConfig {
  /** Fallback content type for unknown sites */
  defaultContentType: ContentType;
  /** Default quality assumption */
  defaultQuality: ContentQuality;
  /** Global content validation rules */
  globalValidation: ContentValidation;
  /** Whether to cache handler instances */
  cacheHandlers: boolean;
}
