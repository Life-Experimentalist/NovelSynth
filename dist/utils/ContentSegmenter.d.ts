import type { ContentSegment, SegmentationOptions } from "../types";
export declare class ContentSegmenter {
    private static readonly DEFAULT_OPTIONS;
    /**
     * Segment content into smaller chunks while preserving images and formatting
     */
    static segmentContent(content: string, options?: Partial<SegmentationOptions>): ContentSegment[];
    /**
     * Reassemble segments back into complete content
     */
    static reassembleSegments(segments: ContentSegment[]): string;
    /**
     * Extract image positions from HTML content
     */
    private static extractImages;
    /**
     * Split content by size with overlap
     */
    private static splitBySize;
    /**
     * Find the last sentence break within a range
     */
    private static findLastSentenceBreak;
}
