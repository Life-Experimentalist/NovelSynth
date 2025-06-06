/**
 * Utility for counting words in text
 */
export const countWords = (text) => {
  if (!text) return 0;

  // Remove HTML tags if present
  const cleanText = text.replace(/<[^>]*>/g, " ");

  // Split by whitespace and filter out empty strings
  const words = cleanText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return words.length;
};

export default {
  countWords,
};
