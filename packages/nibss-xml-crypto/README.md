# nibss-xml-crypto

Small installable JavaScript package that mirrors the XML signing and
encryption behavior currently used in the Java/NestJS NIBSS flows.

## What it does

- Signs XML with:
  - inclusive canonicalization
  - enveloped signature transform
  - SHA-256 digest
  - RSA-SHA256 signature
- Encrypts a target element's content with:
  - AES-256-GCM
  - RSA-OAEP key wrapping with SHA-1
  - `EncryptedData` inserted inside the target element

## Install locally

From another JavaScript project:

```bash
npm install /absolute/path/to/nibbs/packages/nibss-xml-crypto
```

Or from `package.json`:

```json
{
  "dependencies": {
    "nibss-xml-crypto": "file:packages/nibss-xml-crypto"
  }
}
```

## Usage

```js
const fs = require("node:fs");
const { signAndEncryptXml } = require("nibss-xml-crypto");

const plainXml = fs.readFileSync("./plain.xml", "utf8");
const privateKeyPem = fs.readFileSync("./my_private.pem", "utf8");
const publicKeyPem = fs.readFileSync("./third_party_public.pem", "utf8");

const { signedXml, signedEncryptedXml } = signAndEncryptXml(plainXml, {
  privateKeyPem,
  publicKeyPem,
  elementName: "FIToFICstmrCdtTrf",
});
```

## Compare against Java output

Run:

```bash
node /path/to/project/scripts/compare-java-xml-crypto.js
```

You can also pass:

1. plain XML path
2. Java signed XML path
3. Java signed-encrypted XML path
4. root tag name

Example:

```bash
node scripts/compare-java-xml-crypto.js \
  /path/to/01-plain.xml \
  /path/to/02-signed.xml \
  /path/to/03-signed-encrypted.xml \
  FIToFICstmrCdtTrf
```

## Important note

Exact byte-for-byte equality for encrypted XML is generally not expected,
because the AES session key, IV, and OAEP padding randomness change on each run.
