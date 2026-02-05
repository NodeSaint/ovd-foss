import { Button } from './ui/Button';
import type { ProofReceipt as ProofReceiptType } from '../types';
import { downloadReceipt } from '../lib/receipt/generator';

interface ProofReceiptProps {
  receipt: ProofReceiptType;
}

export function ProofReceipt({ receipt }: ProofReceiptProps) {
  const handleDownloadText = () => {
    downloadReceipt(receipt, 'text');
  };

  const handleDownloadHtml = () => {
    downloadReceipt(receipt, 'html');
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Verification Receipt</h3>
      </div>
      <div className="p-4 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="text-gray-500">Status</div>
          <div
            className={`font-medium ${
              receipt.verificationStatus === 'valid' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {receipt.verificationStatus.toUpperCase()}
          </div>

          <div className="text-gray-500">Document</div>
          <div className="font-medium text-gray-900 truncate">{receipt.title}</div>

          <div className="text-gray-500">Signed</div>
          <div className="text-gray-900">
            {new Date(receipt.signatureTimestamp).toLocaleString()}
          </div>

          <div className="text-gray-500">Signer</div>
          <div className="font-mono text-xs text-gray-900">{receipt.signerFingerprint}</div>

          <div className="text-gray-500">Verified</div>
          <div className="text-gray-900">{new Date(receipt.verifiedAt).toLocaleString()}</div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
        <Button size="sm" variant="secondary" onClick={handleDownloadText}>
          Download TXT
        </Button>
        <Button size="sm" variant="secondary" onClick={handleDownloadHtml}>
          Download HTML
        </Button>
      </div>
    </div>
  );
}
