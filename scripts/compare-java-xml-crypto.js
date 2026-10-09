"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const {
  signAndEncryptXml,
} = require("../packages/nibss-xml-crypto");

const PLAIN_XML_PATH =
  process.argv[2] ??
  "/path/to/project/debug-output/pacs008/01-plain-pacs008-20260618_091926.xml";
const JAVA_SIGNED_XML_PATH =
  process.argv[3] ??
  "/path/to/project/debug-output/pacs008/02-signed-pacs008-20260618_091926.xml";
const JAVA_SIGNED_ENCRYPTED_XML_PATH =
  process.argv[4] ??
  "/path/to/project/debug-output/pacs008/03-signed-encrypted-pacs008-20260618_091926.xml";
const ROOT_TAG = process.argv[5] ?? "FIToFICstmrCdtTrf";

const privateKeyPem = fs.readFileSync(
  "keys/local-private.pem",
  "utf8",
);
const counterpartyPublicKeyPem = fs.readFileSync(
  "keys/counterparty-public.pem",
  "utf8",
);

const plainXml = fs.readFileSync(PLAIN_XML_PATH, "utf8");
const javaSignedXml = fs.readFileSync(JAVA_SIGNED_XML_PATH, "utf8");
const javaSignedEncryptedXml = fs.readFileSync(
  JAVA_SIGNED_ENCRYPTED_XML_PATH,
  "utf8",
);

const { signedXml, signedEncryptedXml } = signAndEncryptXml(plainXml, {
  privateKeyPem,
  publicKeyPem: counterpartyPublicKeyPem,
  elementName: ROOT_TAG,
});

const outputDirectory = path.join(
  "/path/to/project/debug-output/library-compare",
);
fs.mkdirSync(outputDirectory, { recursive: true });

const signedPath = path.join(outputDirectory, "signed-from-library.xml");
const encryptedPath = path.join(
  outputDirectory,
  "signed-encrypted-from-library.xml",
);

fs.writeFileSync(signedPath, signedXml, "utf8");
fs.writeFileSync(encryptedPath, signedEncryptedXml, "utf8");

const javaSignedHash = sha256(javaSignedXml);
const librarySignedHash = sha256(signedXml);
const javaEncryptedHash = sha256(javaSignedEncryptedXml);
const libraryEncryptedHash = sha256(signedEncryptedXml);

console.log("Comparison results");
console.log(`plain xml input: ${PLAIN_XML_PATH}`);
console.log(`java signed xml: ${JAVA_SIGNED_XML_PATH}`);
console.log(`library signed xml: ${signedPath}`);
console.log(`java signed-encrypted xml: ${JAVA_SIGNED_ENCRYPTED_XML_PATH}`);
console.log(`library signed-encrypted xml: ${encryptedPath}`);
console.log("");
console.log(`signed xml exact match: ${javaSignedXml === signedXml}`);
console.log(`signed xml java sha256: ${javaSignedHash}`);
console.log(`signed xml library sha256: ${librarySignedHash}`);
console.log("");
console.log(
  `signed-encrypted xml exact match: ${javaSignedEncryptedXml === signedEncryptedXml}`,
);
console.log(`signed-encrypted java sha256: ${javaEncryptedHash}`);
console.log(`signed-encrypted library sha256: ${libraryEncryptedHash}`);
console.log("");
console.log(
  "Note: signed-encrypted XML is expected to differ across runs because AES-GCM and RSA-OAEP use fresh randomness.",
);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
