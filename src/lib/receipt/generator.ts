import type { SignedDocument, VerificationResult, ProofReceipt } from '../../types';
import { generateTextReceipt, generateHtmlReceipt } from './templates';

export interface GenerateReceiptOptions {
  signedDocument: SignedDocument;
  verificationResult: VerificationResult;
  title?: string;
}

export function generateReceipt(options: GenerateReceiptOptions): ProofReceipt {
  const { signedDocument, verificationResult, title } = options;

  return {
    title: title || signedDocument.document.originalFilename || 'Untitled Document',
    documentHash: signedDocument.document.canonicalHash,
    signatureTimestamp: signedDocument.signature.timestamp,
    signerFingerprint: signedDocument.publicKey.fingerprint,
    verificationStatus: verificationResult.valid ? 'valid' : 'invalid',
    verifiedAt: new Date().toISOString(),
    originalFilename: signedDocument.document.originalFilename,
  };
}

export function exportReceiptAsText(receipt: ProofReceipt): string {
  return generateTextReceipt(receipt);
}

export function exportReceiptAsHtml(receipt: ProofReceipt): string {
  return generateHtmlReceipt(receipt);
}

export function downloadReceipt(receipt: ProofReceipt, format: 'text' | 'html'): void {
  const content = format === 'text' ? exportReceiptAsText(receipt) : exportReceiptAsHtml(receipt);
  const mimeType = format === 'text' ? 'text/plain' : 'text/html';
  const extension = format === 'text' ? 'txt' : 'html';

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `verification-receipt.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
