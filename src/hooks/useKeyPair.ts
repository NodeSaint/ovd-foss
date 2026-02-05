import { useState, useEffect, useCallback } from 'react';
import type { KeyPair, ExportedKeyPair } from '../types';
import { generateKeyPair, exportKeyPair, importKeyPair, validateKeyPair } from '../lib/crypto/keys';
import { generateFingerprint } from '../utils/fingerprint';

const STORAGE_KEY = 'ovd-keypair';

interface UseKeyPairResult {
  keyPair: KeyPair | null;
  fingerprint: string | null;
  isLoading: boolean;
  generate: () => void;
  clear: () => void;
  exportKeys: () => ExportedKeyPair | null;
  importKeys: (exported: ExportedKeyPair) => boolean;
}

export function useKeyPair(): UseKeyPairResult {
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const exported: ExportedKeyPair = JSON.parse(stored);
        const imported = importKeyPair(exported);
        if (validateKeyPair(imported)) {
          setKeyPair(imported);
          setFingerprint(exported.fingerprint);
        }
      }
    } catch {
      // Invalid stored data, ignore
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage when keyPair changes
  useEffect(() => {
    if (keyPair) {
      const exported = exportKeyPair(keyPair);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exported));
      setFingerprint(exported.fingerprint);
    }
  }, [keyPair]);

  const generate = useCallback(() => {
    const newKeyPair = generateKeyPair();
    setKeyPair(newKeyPair);
    setFingerprint(generateFingerprint(newKeyPair.publicKey));
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setKeyPair(null);
    setFingerprint(null);
  }, []);

  const exportKeys = useCallback((): ExportedKeyPair | null => {
    if (!keyPair) return null;
    return exportKeyPair(keyPair);
  }, [keyPair]);

  const importKeys = useCallback((exported: ExportedKeyPair): boolean => {
    try {
      const imported = importKeyPair(exported);
      if (!validateKeyPair(imported)) {
        return false;
      }
      setKeyPair(imported);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    keyPair,
    fingerprint,
    isLoading,
    generate,
    clear,
    exportKeys,
    importKeys,
  };
}
