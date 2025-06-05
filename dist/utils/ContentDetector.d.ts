import type { ContentAnalysis, SiteHandler } from "../types";
export declare class ContentDetector {
    private static readonly MIN_WORD_COUNT;
    private static readonly WORDS_PER_MINUTE;
    static analyzeContent(handlers: SiteHandler[]): ContentAnalysis;
    private static extractTextFromSelector;
    private static extractGenericContent;
    private static countWords;
    private static detectContentType;
    private static calculateConfidence;
}
