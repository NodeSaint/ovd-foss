import { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CopyButton } from './ui/CopyButton';
import type { ExportedKeyPair } from '../types';

interface KeyManagerProps {
  fingerprint: string | null;
  hasKeyPair: boolean;
  onGenerate: () => void;
  onClear: () => void;
  onExport: () => ExportedKeyPair | null;
  onImport: (keys: ExportedKeyPair) => boolean;
}

export function KeyManager({
  fingerprint,
  hasKeyPair,
  onGenerate,
  onClear,
  onExport,
  onImport,
}: KeyManagerProps) {
  const [showExport, setShowExport] = useState(false);
  const [exportedKeys, setExportedKeys] = useState<ExportedKeyPair | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const keys = onExport();
    if (keys) {
      setExportedKeys(keys);
      setShowExport(true);
    }
  };

  const handleDownload = () => {
    if (!exportedKeys) return;
    const blob = new Blob([JSON.stringify(exportedKeys, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ovd-keypair-${exportedKeys.fingerprint}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const keys = JSON.parse(reader.result as string) as ExportedKeyPair;
        if (!keys.privateKey || !keys.publicKey || !keys.fingerprint) {
          setImportError('Invalid key file format');
          return;
        }
        const success = onImport(keys);
        if (success) {
          setImportError(null);
        } else {
          setImportError('Failed to import keys. Invalid keypair.');
        }
      } catch {
        setImportError('Failed to parse key file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <Card title="Key Management">
      {hasKeyPair ? (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Your Key Fingerprint</div>
            <div className="flex items-center gap-3">
              <code className="text-lg font-mono font-semibold text-gray-900">
                {fingerprint}
              </code>
              <CopyButton text={fingerprint || ''} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleExport}>
              Export Keys
            </Button>
            <Button variant="danger" onClick={onClear}>
              Delete Keys
            </Button>
          </div>

          {showExport && exportedKeys && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    Keep your private key secure!
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Anyone with your private key can sign documents as you.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={handleDownload}>
                  Download JSON
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowExport(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <p className="text-gray-600 mb-1">No keypair found</p>
            <p className="text-sm text-gray-500">
              Generate a new keypair or import an existing one
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={onGenerate}>Generate New Keypair</Button>
            <Button variant="secondary" onClick={handleImportClick}>
              Import Keys
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          {importError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {importError}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
