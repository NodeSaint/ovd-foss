import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { FileDropzone } from './ui/FileDropzone';
import { StatusIndicator } from './ui/StatusIndicator';
import { ProofReceipt } from './ProofReceipt';
import { useVerification } from '../hooks/useVerification';

export function DocumentVerifier() {
  const {
    signedDocument,
    originalContent,
    result,
    receipt,
    error,
    loadSignedDocument,
    loadOriginalContent,
    verify,
    reset,
  } = useVerification();

  const [signedFilename, setSignedFilename] = useState<string | null>(null);
  const [originalFilename, setOriginalFilename] = useState<string | null>(null);

  const handleSignedDocLoad = (content: string, filename: string) => {
    const success = loadSignedDocument(content);
    if (success) {
      setSignedFilename(filename);
    }
  };

  const handleOriginalLoad = (content: string, filename: string) => {
    loadOriginalContent(content);
    setOriginalFilename(filename);
  };

  const handleReset = () => {
    reset();
    setSignedFilename(null);
    setOriginalFilename(null);
  };

  return (
    <Card title="Verify Document">
      <div className="space-y-6">
        {/* Step 1: Load signed document */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              1
            </span>
            <span className="font-medium text-gray-900">Load signed document (.ovd.json)</span>
            {signedDocument && (
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          {!signedDocument ? (
            <FileDropzone
              onFile={handleSignedDocLoad}
              accept={{ 'application/json': ['.json', '.ovd.json'] }}
              label="Drop signed document"
              description=".ovd.json file"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{signedFilename}</div>
                  <div className="text-xs text-gray-500">
                    Signed at {new Date(signedDocument.signature.timestamp).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Signer: <code className="font-mono">{signedDocument.publicKey.fingerprint}</code>
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={handleReset}>
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Load original document */}
        {signedDocument && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                2
              </span>
              <span className="font-medium text-gray-900">Load original document</span>
              {originalContent && (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            {!originalContent ? (
              <FileDropzone
                onFile={handleOriginalLoad}
                label="Drop original document"
                description={
                  signedDocument.document.originalFilename
                    ? `Expected: ${signedDocument.document.originalFilename}`
                    : 'The original file that was signed'
                }
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{originalFilename}</div>
                    <div className="text-xs text-gray-500">
                      {originalContent.length.toLocaleString()} characters
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Verify */}
        {signedDocument && originalContent && !result && (
          <Button onClick={verify} className="w-full">
            Verify Signature
          </Button>
        )}

        {/* Error display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Verification result */}
        {result && (
          <div className="space-y-4">
            <StatusIndicator
              status={result.valid ? 'valid' : 'invalid'}
              message={result.valid ? 'Document is authentic' : result.error}
            />

            {result.details && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 text-xs">Hash Match</div>
                  <div
                    className={`font-medium ${
                      result.details.hashMatches ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.details.hashMatches ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 text-xs">Signature Valid</div>
                  <div
                    className={`font-medium ${
                      result.details.signatureValid ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.details.signatureValid ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            )}

            {receipt && <ProofReceipt receipt={receipt} />}

            <Button variant="secondary" onClick={handleReset} className="w-full">
              Verify Another Document
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
