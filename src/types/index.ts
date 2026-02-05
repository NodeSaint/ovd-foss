export type ContentType = 'text/plain' | 'text/markdown' | 'application/json';

export interface SignedDocument {
  version: 'ovd-v1';
  document: {
    contentType: ContentType;
    canonicalHash: string;
    originalFilename?: string;
  };
  signature: {
    algorithm: 'Ed25519';
    value: string; // Base64
    timestamp: string; // ISO 8601
  };
  publicKey: {
    algorithm: 'Ed25519';
    value: string; // Base64
    fingerprint: string;
  };
}

export interface KeyPair {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

export interface ExportedKeyPair {
  privateKey: string; // Base64
  publicKey: string; // Base64
  fingerprint: string;
}

export interface VerificationResult {
  valid: boolean;
  error?: string;
  document?: SignedDocument;
  details?: {
    signatureValid: boolean;
    hashMatches: boolean;
    timestamp: Date;
    fingerprint: string;
  };
}

export interface ProofReceipt {
  title: string;
  documentHash: string;
  signatureTimestamp: string;
  signerFingerprint: string;
  verificationStatus: 'valid' | 'invalid';
  verifiedAt: string;
  originalFilename?: string;
}
