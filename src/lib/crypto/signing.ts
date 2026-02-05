import * as ed25519 from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';
import type { KeyPair, SignedDocument, ContentType } from '../../types';
import { bytesToBase64, stringToBytes } from '../../utils/encoding';
import { generateFingerprint } from '../../utils/fingerprint';
import { hashString } from './hash';

// Enable synchronous methods
ed25519.hashes.sha512 = (msg: Uint8Array) => sha512(msg);

export interface SignOptions {
  content: string;
  contentType: ContentType;
  keyPair: KeyPair;
  originalFilename?: string;
}

/**
 * Sign a document and create a SignedDocument bundle
 */
export function signDocument(options: SignOptions): SignedDocument {
  const { content, contentType, keyPair, originalFilename } = options;

  // Hash the canonical content
  const canonicalHash = hashString(content);

  // Sign the hash
  const hashBytes = stringToBytes(canonicalHash);
  const signature = ed25519.sign(hashBytes, keyPair.privateKey);

  const signedDocument: SignedDocument = {
    version: 'ovd-v1',
    document: {
      contentType,
      canonicalHash,
      ...(originalFilename && { originalFilename }),
    },
    signature: {
      algorithm: 'Ed25519',
      value: bytesToBase64(signature),
      timestamp: new Date().toISOString(),
    },
    publicKey: {
      algorithm: 'Ed25519',
      value: bytesToBase64(keyPair.publicKey),
      fingerprint: generateFingerprint(keyPair.publicKey),
    },
  };

  return signedDocument;
}
