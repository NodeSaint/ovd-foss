import { normalizeText } from './text';

/**
 * Canonicalize markdown content
 * Uses the same text normalization as plain text
 * Future: could add markdown-specific normalization (e.g., heading styles)
 */
export function canonicalizeMarkdown(markdown: string): string {
  return normalizeText(markdown);
}
