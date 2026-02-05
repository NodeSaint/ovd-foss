/**
 * PDF canonicalization stub
 * PDF support is planned for a future release
 */

export class PdfNotSupportedError extends Error {
  constructor() {
    super('PDF canonicalization is not yet supported. Coming soon!');
    this.name = 'PdfNotSupportedError';
  }
}

export function canonicalizePdf(_content: Uint8Array): never {
  throw new PdfNotSupportedError();
}

export function isPdfSupported(): boolean {
  return false;
}
