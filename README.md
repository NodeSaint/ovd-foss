# OVD - Open Verifiable Documents

A local-first, open-source toolkit for cryptographically signing and verifying documents using Ed25519 signatures.

## What is OVD?

OVD lets you prove that a document:
- Was signed by a specific person (identified by their key fingerprint)
- Has not been modified since signing

All cryptography runs in your browser. No servers, no accounts, no tracking.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## How to Use

### 1. Generate a Keypair

Go to the **Keys** tab and click "Generate New Keypair". You'll see your fingerprint in the format:

```
A1B2-C3D4-E5F6-G7H8
```

This fingerprint uniquely identifies your key. Share it with others so they can verify documents you've signed.

**Important:** Export and backup your keys! If you clear your browser data, your keys will be lost.

### 2. Sign a Document

1. Go to the **Sign** tab
2. Drop a file (.txt, .md, or .json)
3. Click "Sign and Download"

This downloads a `.ovd.json` file containing:
- The document's hash (not the content itself)
- Your signature
- Your public key
- A timestamp

### 3. Verify a Document

1. Go to the **Verify** tab
2. Drop the `.ovd.json` signed document
3. Drop the original file
4. Click "Verify Signature"

You'll see either:
- **Valid** (green) - The document is authentic and unmodified
- **Invalid** (red) - The document was modified or the signature is bad

You can download a verification receipt as proof.

## Signed Document Format

```json
{
  "version": "ovd-v1",
  "document": {
    "contentType": "text/plain",
    "canonicalHash": "abc123...",
    "originalFilename": "contract.txt"
  },
  "signature": {
    "algorithm": "Ed25519",
    "value": "base64...",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "publicKey": {
    "algorithm": "Ed25519",
    "value": "base64...",
    "fingerprint": "A1B2-C3D4-E5F6-G7H8"
  }
}
```

## Supported File Types

| Type | Extension | Canonicalization |
|------|-----------|------------------|
| Plain text | .txt | Normalize line endings, trim whitespace, NFC unicode |
| Markdown | .md | Same as plain text |
| JSON | .json | Sorted keys, no whitespace |
| PDF | .pdf | Coming soon |

## Key Management

### Export Keys
1. Go to **Keys** tab
2. Click "Export Keys"
3. Download the JSON file
4. Store it securely (it contains your private key!)

### Import Keys
1. Go to **Keys** tab
2. Click "Import Keys"
3. Select your exported JSON file

## Security Notes

- **Private keys** are stored in your browser's localStorage
- **Never share** your private key or exported key file
- **Do share** your fingerprint so others can verify your signatures
- The signed document contains only a hash, not the original content

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder. Deploy to any static hosting.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- @noble/ed25519 (signatures)
- @noble/hashes (SHA-256)
- react-dropzone (file handling)

## License

MIT
