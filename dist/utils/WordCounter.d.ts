export interface WordCountStats {
    originalWords: number;
    enhancedWords: number;
    wordsChanged: number;
    percentageChange: number;
    charactersOriginal: number;
    charactersEnhanced: number;
}
export declare class WordCounter {
    /**
     * Count words in text content
     */
    static countWords(text: string): number;
    /**
     * Count characters in text content
     */
    static countCharacters(text: string): number;
    /**
     * Calculate enhancement statistics
     */
    static calculateStats(originalText: string, enhancedText: string): WordCountStats;
    /**
     * Format word count for display
     */
    static formatWordCount(count: number): string;
    /**
     * Format percentage change for display
     */
    static formatPercentageChange(percentage: number): string;
    /**
     * Format word change for display
     */
    static formatWordChange(change: number): string;
    /**
     * Get reading time estimate (assuming 200 words per minute)
     */
    static getReadingTime(wordCount: number): string;
    /**
     * Extract word count from page content
     */
    static extractContentWordCount(element: Element): number;
}
