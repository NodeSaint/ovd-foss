import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, stringToBytes } from '../../utils/encoding';

/**
 * Hash a string using SHA-256
 */
export function hashString(data: string): string {
  const bytes = stringToBytes(data);
  const hash = sha256(bytes);
  return bytesToHex(hash);
}

/**
 * Hash bytes using SHA-256
 */
export function hashBytes(data: Uint8Array): string {
  const hash = sha256(data);
  return bytesToHex(hash);
}
