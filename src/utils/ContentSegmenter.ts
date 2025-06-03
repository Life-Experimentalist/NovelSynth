import type {
  ContentSegment,
  ImagePosition,
  SegmentationOptions,
} from "../types";

export class ContentSegmenter {
  private static readonly DEFAULT_OPTIONS: SegmentationOptions = {
    maxChunkSize: 12000,
    preserveImages: true,
    preserveFormatting: true,
    overlapSize: 200,
  };

  /**
   * Segment content into smaller chunks while preserving images and formatting
   */
  static segmentContent(
    content: string,
    options: Partial<SegmentationOptions> = {}
  ): ContentSegment[] {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const segments: ContentSegment[] = [];

    // Extract images first if preservation is enabled
    const imagePositions = opts.preserveImages
      ? this.extractImages(content)
      : [];

    // Remove images from content for segmentation, but keep placeholders
    let workingContent = content;
    const imagePlaceholders: string[] = [];

    if (opts.preserveImages) {
      imagePositions.forEach((img, index) => {
        const placeholder = `__IMAGE_PLACEHOLDER_${index}__`;
        imagePlaceholders.push(placeholder);
        workingContent = workingContent.replace(img.originalTag, placeholder);
      });
    }

    // Split content into segments
    const segments_raw = this.splitBySize(
      workingContent,
      opts.maxChunkSize,
      opts.overlapSize
    );

    // Create segment objects
    segments_raw.forEach((segment, index) => {
      // Restore images in this segment
      let segmentContent = segment.content;
      const segmentImages: ImagePosition[] = [];

      if (opts.preserveImages) {
        imagePlaceholders.forEach((placeholder, imgIndex) => {
          if (segmentContent.includes(placeholder)) {
            const originalImage = imagePositions[imgIndex];
            segmentContent = segmentContent.replace(
              placeholder,
              originalImage.originalTag
            );
            segmentImages.push({
              ...originalImage,
              position: segmentContent.indexOf(originalImage.originalTag),
            });
          }
        });
      }

      segments.push({
        id: `segment_${index}`,
        content: segmentContent,
        startIndex: segment.startIndex,
        endIndex: segment.endIndex,
        preserveImages: opts.preserveImages,
        imagePositions: segmentImages,
      });
    });

    return segments;
  }

  /**
   * Reassemble segments back into complete content
   */
  static reassembleSegments(segments: ContentSegment[]): string {
    // Sort segments by start index
    const sortedSegments = segments.sort((a, b) => a.startIndex - b.startIndex);

    // Combine content, removing overlaps
    let reassembled = "";
    let lastEndIndex = 0;

    sortedSegments.forEach((segment, index) => {
      if (index === 0) {
        reassembled = segment.content;
        lastEndIndex = segment.endIndex;
      } else {
        // Remove overlap with previous segment
        const overlapStart = Math.max(0, lastEndIndex - segment.startIndex);
        const segmentContent =
          overlapStart > 0
            ? segment.content.substring(overlapStart)
            : segment.content;

        reassembled += segmentContent;
        lastEndIndex = segment.endIndex;
      }
    });

    return reassembled;
  }

  /**
   * Extract image positions from HTML content
   */
  private static extractImages(content: string): ImagePosition[] {
    const images: ImagePosition[] = [];
    const imgRegex = /<img[^>]*>/gi;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      const imgTag = match[0];
      const srcMatch = imgTag.match(/src=["']([^"']*)["']/i);
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
      const titleMatch = imgTag.match(/title=["']([^"']*)["']/i);

      if (srcMatch) {
        images.push({
          src: srcMatch[1],
          alt: altMatch ? altMatch[1] : undefined,
          title: titleMatch ? titleMatch[1] : undefined,
          position: match.index,
          originalTag: imgTag,
        });
      }
    }

    return images;
  }

  /**
   * Split content by size with overlap
   */
  private static splitBySize(
    content: string,
    maxSize: number,
    overlapSize: number
  ): { content: string; startIndex: number; endIndex: number }[] {
    const segments: {
      content: string;
      startIndex: number;
      endIndex: number;
    }[] = [];

    if (content.length <= maxSize) {
      return [
        {
          content,
          startIndex: 0,
          endIndex: content.length,
        },
      ];
    }

    let currentIndex = 0;

    while (currentIndex < content.length) {
      const endIndex = Math.min(currentIndex + maxSize, content.length);
      let segmentEnd = endIndex;

      // Try to break at a sentence boundary if we're not at the end
      if (endIndex < content.length) {
        const searchStart = Math.max(currentIndex, endIndex - 500);
        const lastSentence = this.findLastSentenceBreak(
          content,
          searchStart,
          endIndex
        );
        if (lastSentence > currentIndex) {
          segmentEnd = lastSentence;
        }
      }

      const segmentContent = content.substring(currentIndex, segmentEnd);
      segments.push({
        content: segmentContent,
        startIndex: currentIndex,
        endIndex: segmentEnd,
      });

      // Move to next segment with overlap
      currentIndex = Math.max(currentIndex + 1, segmentEnd - overlapSize);
    }

    return segments;
  }

  /**
   * Find the last sentence break within a range
   */
  private static findLastSentenceBreak(
    content: string,
    start: number,
    end: number
  ): number {
    const searchContent = content.substring(start, end);
    const sentenceBreaks = [". ", "! ", "? ", ".\n", "!\n", "?\n"];

    let lastBreak = -1;
    sentenceBreaks.forEach((breakStr) => {
      const index = searchContent.lastIndexOf(breakStr);
      if (index > lastBreak) {
        lastBreak = index + breakStr.length;
      }
    });

    return lastBreak > -1 ? start + lastBreak : end;
  }
}
