/**
 * Create canonical JSON representation
 * - Sorted keys (recursively)
 * - No whitespace
 * - Consistent number formatting
 */
export function canonicalizeJson(input: string | object): string {
  const obj = typeof input === 'string' ? JSON.parse(input) : input;
  return JSON.stringify(sortObject(obj));
}

function sortObject(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }

  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj as Record<string, unknown>).sort();

  for (const key of keys) {
    sorted[key] = sortObject((obj as Record<string, unknown>)[key]);
  }

  return sorted;
}

/**
 * Validate JSON and return parsed object or null
 */
export function parseJson(input: string): object | null {
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
