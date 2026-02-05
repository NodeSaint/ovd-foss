/**
 * Normalize text content for consistent hashing
 * - Normalize to NFC Unicode form
 * - Convert all line endings to LF
 * - Trim trailing whitespace from each line
 * - Ensure single trailing newline
 */
export function normalizeText(text: string): string {
  return (
    text
      // Normalize Unicode to NFC form
      .normalize('NFC')
      // Normalize line endings to LF
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Trim trailing whitespace from each line
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      // Ensure single trailing newline
      .trimEnd() + '\n'
  );
}
