
/**
 * Map markdown text
 *
 */
export const MarkDown = (markdown: string): string => {
  // const boldRegex = /\*\*(.*?)\*\*/g;
  const boldRegex = /__(.*?)__/g;
  const italicRegex = /_(.*?)_/g;
  // const italicRegex = /\*(.*?)\*/g;

  return markdown
    .replace(boldRegex, "<strong>$1</strong>")
    .replace(italicRegex, "<em>$1</em>");
}