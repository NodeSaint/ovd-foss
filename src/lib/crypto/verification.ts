import * as ed25519 from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';
import type { SignedDocument, VerificationResult } from '../../types';
import { base64ToBytes, stringToBytes } from '../../utils/encoding';
import { generateFingerprint } from '../../utils/fingerprint';
import { hashString } from './hash';

// Enable synchronous methods
ed25519.hashes.sha512 = (msg: Uint8Array) => sha512(msg);

/**
 * Verify a signed document against its original content
 */
export function verifyDocument(
  signedDocument: SignedDocument,
  canonicalContent: string
): VerificationResult {
  try {
    // Validate document structure
    if (signedDocument.version !== 'ovd-v1') {
      return { valid: false, error: 'Unsupported document version' };
    }

    if (signedDocument.signature.algorithm !== 'Ed25519') {
      return { valid: false, error: 'Unsupported signature algorithm' };
    }

    // Hash the provided content and compare
    const computedHash = hashString(canonicalContent);
    const hashMatches = computedHash === signedDocument.document.canonicalHash;

    if (!hashMatches) {
      return {
        valid: false,
        error: 'Document hash does not match. The document may have been modified.',
        document: signedDocument,
        details: {
          signatureValid: false,
          hashMatches: false,
          timestamp: new Date(signedDocument.signature.timestamp),
          fingerprint: signedDocument.publicKey.fingerprint,
        },
      };
    }

    // Verify the signature
    const publicKey = base64ToBytes(signedDocument.publicKey.value);
    const signature = base64ToBytes(signedDocument.signature.value);
    const hashBytes = stringToBytes(signedDocument.document.canonicalHash);

    const signatureValid = ed25519.verify(signature, hashBytes, publicKey);

    if (!signatureValid) {
      return {
        valid: false,
        error: 'Invalid signature',
        document: signedDocument,
        details: {
          signatureValid: false,
          hashMatches: true,
          timestamp: new Date(signedDocument.signature.timestamp),
          fingerprint: signedDocument.publicKey.fingerprint,
        },
      };
    }

    // Verify fingerprint matches public key
    const computedFingerprint = generateFingerprint(publicKey);
    if (computedFingerprint !== signedDocument.publicKey.fingerprint) {
      return {
        valid: false,
        error: 'Public key fingerprint mismatch',
        document: signedDocument,
      };
    }

    return {
      valid: true,
      document: signedDocument,
      details: {
        signatureValid: true,
        hashMatches: true,
        timestamp: new Date(signedDocument.signature.timestamp),
        fingerprint: signedDocument.publicKey.fingerprint,
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown verification error',
    };
  }
}

/**
 * Parse and validate a SignedDocument from JSON
 */
export function parseSignedDocument(json: string): SignedDocument | null {
  try {
    const parsed = JSON.parse(json);

    // Basic structure validation
    if (
      parsed.version !== 'ovd-v1' ||
      !parsed.document?.canonicalHash ||
      !parsed.signature?.value ||
      !parsed.publicKey?.value
    ) {
      return null;
    }

    return parsed as SignedDocument;
  } catch {
    return null;
  }
}
