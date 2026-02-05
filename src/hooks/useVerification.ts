import { useState, useCallback } from 'react';
import type { SignedDocument, VerificationResult, ProofReceipt } from '../types';
import { verifyDocument, parseSignedDocument } from '../lib/crypto/verification';
import { generateReceipt } from '../lib/receipt/generator';
import { normalizeText } from '../lib/canonical/text';
import { canonicalizeJson } from '../lib/canonical/json';
import { canonicalizeMarkdown } from '../lib/canonical/markdown';

interface VerificationState {
  signedDocument: SignedDocument | null;
  originalContent: string | null;
  result: VerificationResult | null;
  receipt: ProofReceipt | null;
  error: string | null;
  isVerifying: boolean;
}

interface UseVerificationResult extends VerificationState {
  loadSignedDocument: (json: string) => boolean;
  loadOriginalContent: (content: string) => void;
  verify: () => void;
  reset: () => void;
}

export function useVerification(): UseVerificationResult {
  const [state, setState] = useState<VerificationState>({
    signedDocument: null,
    originalContent: null,
    result: null,
    receipt: null,
    error: null,
    isVerifying: false,
  });

  const loadSignedDocument = useCallback((json: string): boolean => {
    const doc = parseSignedDocument(json);
    if (!doc) {
      setState((prev) => ({
        ...prev,
        error: 'Invalid signed document format',
        signedDocument: null,
      }));
      return false;
    }
    setState((prev) => ({
      ...prev,
      signedDocument: doc,
      error: null,
      result: null,
      receipt: null,
    }));
    return true;
  }, []);

  const loadOriginalContent = useCallback((content: string) => {
    setState((prev) => ({
      ...prev,
      originalContent: content,
      result: null,
      receipt: null,
    }));
  }, []);

  const verify = useCallback(() => {
    setState((prev) => {
      if (!prev.signedDocument || !prev.originalContent) {
        return {
          ...prev,
          error: 'Both signed document and original content are required',
        };
      }

      // Canonicalize based on content type
      let canonicalContent: string;
      try {
        switch (prev.signedDocument.document.contentType) {
          case 'application/json':
            canonicalContent = canonicalizeJson(prev.originalContent);
            break;
          case 'text/markdown':
            canonicalContent = canonicalizeMarkdown(prev.originalContent);
            break;
          case 'text/plain':
          default:
            canonicalContent = normalizeText(prev.originalContent);
        }
      } catch {
        return {
          ...prev,
          error: 'Failed to canonicalize content',
          result: null,
        };
      }

      const result = verifyDocument(prev.signedDocument, canonicalContent);

      const receipt = generateReceipt({
        signedDocument: prev.signedDocument,
        verificationResult: result,
      });

      return {
        ...prev,
        result,
        receipt,
        error: null,
        isVerifying: false,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      signedDocument: null,
      originalContent: null,
      result: null,
      receipt: null,
      error: null,
      isVerifying: false,
    });
  }, []);

  return {
    ...state,
    loadSignedDocument,
    loadOriginalContent,
    verify,
    reset,
  };
}
