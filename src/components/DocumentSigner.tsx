import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { FileDropzone } from './ui/FileDropzone';
import type { KeyPair, ContentType } from '../types';
import { signDocument } from '../lib/crypto/signing';
import { normalizeText } from '../lib/canonical/text';
import { canonicalizeJson, parseJson } from '../lib/canonical/json';
import { canonicalizeMarkdown } from '../lib/canonical/markdown';

interface DocumentSignerProps {
  keyPair: KeyPair | null;
  fingerprint: string | null;
}

export function DocumentSigner({ keyPair, fingerprint }: DocumentSignerProps) {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState<string | null>(null);
  const [contentType, setContentType] = useState<ContentType>('text/plain');
  const [error, setError] = useState<string | null>(null);

  const handleFileLoad = (fileContent: string, name: string) => {
    setContent(fileContent);
    setFilename(name);
    setError(null);

    // Auto-detect content type from extension
    if (name.endsWith('.json')) {
      setContentType('application/json');
    } else if (name.endsWith('.md') || name.endsWith('.markdown')) {
      setContentType('text/markdown');
    } else {
      setContentType('text/plain');
    }
  };

  const handleSign = () => {
    if (!keyPair) {
      setError('No keypair available. Generate or import keys first.');
      return;
    }

    if (!content.trim()) {
      setError('No content to sign.');
      return;
    }

    try {
      // Canonicalize content based on type
      let canonicalContent: string;
      switch (contentType) {
        case 'application/json':
          const parsed = parseJson(content);
          if (!parsed) {
            setError('Invalid JSON content.');
            return;
          }
          canonicalContent = canonicalizeJson(parsed);
          break;
        case 'text/markdown':
          canonicalContent = canonicalizeMarkdown(content);
          break;
        case 'text/plain':
        default:
          canonicalContent = normalizeText(content);
      }

      const signedDoc = signDocument({
        content: canonicalContent,
        contentType,
        keyPair,
        originalFilename: filename || undefined,
      });

      // Download the signed document
      const blob = new Blob([JSON.stringify(signedDoc, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = filename ? filename.replace(/\.[^/.]+$/, '') : 'document';
      a.download = `${baseName}.ovd.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign document');
    }
  };

  const handleClear = () => {
    setContent('');
    setFilename(null);
    setError(null);
  };

  if (!keyPair) {
    return (
      <Card title="Sign Document">
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-gray-600 mb-1">No keypair available</p>
          <p className="text-sm text-gray-500">
            Go to the Keys tab to generate or import a keypair
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Sign Document">
      <div className="space-y-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span className="text-sm text-blue-800">
              Signing as: <code className="font-mono font-semibold">{fingerprint}</code>
            </span>
          </div>
        </div>

        {!content ? (
          <FileDropzone
            onFile={handleFileLoad}
            accept={{
              'text/plain': ['.txt'],
              'text/markdown': ['.md', '.markdown'],
              'application/json': ['.json'],
            }}
            label="Drop a document to sign"
            description="Supports .txt, .md, and .json files"
          />
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium text-gray-900">
                    {filename || 'Untitled document'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {content.length.toLocaleString()} characters
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={handleClear}>
                  Clear
                </Button>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="text/plain">Plain Text</option>
                  <option value="text/markdown">Markdown</option>
                  <option value="application/json">JSON</option>
                </select>
              </div>
              <pre className="text-xs text-gray-600 bg-white p-3 rounded border border-gray-200 max-h-40 overflow-auto">
                {content.slice(0, 500)}
                {content.length > 500 && '...'}
              </pre>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <Button onClick={handleSign} className="w-full">
              Sign and Download
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
