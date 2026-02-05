import * as ed25519 from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';
import type { KeyPair, ExportedKeyPair } from '../../types';
import { bytesToBase64, base64ToBytes } from '../../utils/encoding';
import { generateFingerprint } from '../../utils/fingerprint';

// Enable synchronous methods
ed25519.hashes.sha512 = (msg: Uint8Array) => sha512(msg);

/**
 * Generate a new Ed25519 keypair
 */
export function generateKeyPair(): KeyPair {
  const { secretKey, publicKey } = ed25519.keygen();
  return { privateKey: secretKey, publicKey };
}

/**
 * Get public key from private key
 */
export function getPublicKey(privateKey: Uint8Array): Uint8Array {
  return ed25519.getPublicKey(privateKey);
}

/**
 * Export keypair to portable format
 */
export function exportKeyPair(keyPair: KeyPair): ExportedKeyPair {
  return {
    privateKey: bytesToBase64(keyPair.privateKey),
    publicKey: bytesToBase64(keyPair.publicKey),
    fingerprint: generateFingerprint(keyPair.publicKey),
  };
}

/**
 * Import keypair from portable format
 */
export function importKeyPair(exported: ExportedKeyPair): KeyPair {
  const privateKey = base64ToBytes(exported.privateKey);
  const publicKey = base64ToBytes(exported.publicKey);
  return { privateKey, publicKey };
}

/**
 * Import just a public key from base64
 */
export function importPublicKey(base64: string): Uint8Array {
  return base64ToBytes(base64);
}

/**
 * Validate that a private key produces the expected public key
 */
export function validateKeyPair(keyPair: KeyPair): boolean {
  const derivedPublicKey = getPublicKey(keyPair.privateKey);
  if (derivedPublicKey.length !== keyPair.publicKey.length) return false;
  return derivedPublicKey.every((byte, i) => byte === keyPair.publicKey[i]);
}
