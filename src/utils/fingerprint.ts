import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from './encoding';

/**
 * Generate a key fingerprint in XXXX-XXXX-XXXX-XXXX format
 * Uses first 8 bytes (16 hex chars) of SHA-256 hash of public key
 */
export function generateFingerprint(publicKey: Uint8Array): string {
  const hash = sha256(publicKey);
  const hex = bytesToHex(hash.slice(0, 8)).toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}`;
}

/**
 * Validate fingerprint format
 */
export function isValidFingerprint(fingerprint: string): boolean {
  return /^[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(fingerprint);
}
