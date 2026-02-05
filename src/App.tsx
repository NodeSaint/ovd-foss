import { useState } from 'react';
import { useKeyPair } from './hooks/useKeyPair';
import { KeyManager } from './components/KeyManager';
import { DocumentSigner } from './components/DocumentSigner';
import { DocumentVerifier } from './components/DocumentVerifier';

type Tab = 'sign' | 'verify' | 'keys';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sign');
  const { keyPair, fingerprint, isLoading, generate, clear, exportKeys, importKeys } =
    useKeyPair();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'sign', label: 'Sign' },
    { id: 'verify', label: 'Verify' },
    { id: 'keys', label: 'Keys' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">OVD</h1>
              <p className="text-sm text-gray-500">Open Verifiable Documents</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Tab navigation */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {tab.label}
              {tab.id === 'keys' && fingerprint && (
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'sign' && (
          <DocumentSigner keyPair={keyPair} fingerprint={fingerprint} />
        )}
        {activeTab === 'verify' && <DocumentVerifier />}
        {activeTab === 'keys' && (
          <KeyManager
            fingerprint={fingerprint}
            hasKeyPair={!!keyPair}
            onGenerate={generate}
            onClear={clear}
            onExport={exportKeys}
            onImport={importKeys}
          />
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>
          OVD uses Ed25519 signatures for cryptographic verification.
          <br />
          Your keys are stored locally in your browser.
        </p>
      </footer>
    </div>
  );
}
