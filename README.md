# NIBSS ISO 20022 Native Generator

This NestJS application generates NIBSS XML directly inside NestJS and exposes Swagger APIs for:

- Generating `acmt.023`, `pain.009`, `pain.010`, and `pain.011` artifacts
- Returning plain, signed, and signed-encrypted XML
- Comparing repeated Nest native output for regression testing
- Decrypting XML for debugging
- Validating XML signatures

The Nest app can now run independently from the Java project for the message types currently implemented in this repository.

## Endpoints

- `POST /api/messages/acmt023/generate`
- `POST /api/messages/acmt023/generate-native`
- `POST /api/messages/acmt023/generate-compare`
- `POST /api/messages/pain009/generate`
- `POST /api/messages/pain009/generate-native`
- `POST /api/messages/pain009/generate-compare`
- `POST /api/messages/pain010/generate`
- `POST /api/messages/pain010/generate-native`
- `POST /api/messages/pain010/generate-compare`
- `POST /api/messages/pain011/generate`
- `POST /api/messages/pain011/generate-native`
- `POST /api/messages/pain011/generate-compare`
- `POST /api/crypto/verify-signature`
- `POST /api/crypto/decrypt`
- `POST /api/crypto/diagnose`
- `GET /api/health`

Swagger UI is available at `/swagger`.

## Generation Flow

`/generate` endpoints:

- Use the current Nest-side implementation to build artifacts locally
- Persist local artifacts under `nibbs/debug-output`
- Return the message ID together with the plain, signed, and signed-encrypted XML

`/generate-native` endpoints:

- Use the same native Nest-side implementation explicitly
- Persist local artifacts under `nibbs/debug-output`

`/generate-compare` endpoints:

- Run the native flow twice
- Return diff previews when any artifact differs

## Required Setup

1. Install dependencies:

```bash
npm install
```

2. Ensure the same key material used by the Java implementation is available locally.

Default paths:

```bash
keys/local-private.pem
keys/local-public.pem
keys/counterparty-public.pem
```

3. Install `xmlsec1` if you want signature verification diagnostics to use the native verifier first.

## Environment Variables

```bash
PORT=3000
NEST_DEBUG_OUTPUT_DIR=/path/to/project/debug-output
LOCAL_PRIVATE_KEY_PATH=keys/local-private.pem
LOCAL_PUBLIC_KEY_PATH=keys/local-public.pem
COUNTERPARTY_PUBLIC_KEY_PATH=keys/counterparty-public.pem
INSTITUTION_ID=000000
CREATOR_NAME=Example Sender Institution
```

## Run

```bash
npm run start:dev
```

## Test

```bash
npm run test
npm run test:e2e
```

## Notes

- The current checked-in Nest implementation supports `acmt.023`, `pain.009`, `pain.010`, and `pain.011` natively.
- Signed and encrypted artifacts can still differ across repeated runs when timestamps, IDs, randomness, providers, or serialization behavior change.
# NIBBS-XML
