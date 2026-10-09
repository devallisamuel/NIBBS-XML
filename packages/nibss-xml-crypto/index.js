"use strict";

const { SignedXml } = require("xml-crypto");
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");
const xpath = require("xpath");
const {
  constants,
  createPublicKey,
  createPrivateKey,
  createCipheriv,
  privateDecrypt,
  publicEncrypt,
  randomBytes,
} = require("node:crypto");

function signXml(xml, privateKeyPem) {
  if (!xml || !privateKeyPem) {
    throw new Error("xml and privateKeyPem are required");
  }

  const signer = new SignedXml({
    privateKey: privateKeyPem,
  });

  signer.canonicalizationAlgorithm =
    "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
  signer.signatureAlgorithm =
    "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
  signer.getKeyInfoContent = () => null;
  signer.addReference({
    xpath: "/*",
    transforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature"],
    digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
    uri: "",
    isEmptyUri: true,
  });

  signer.computeSignature(xml, {
    location: {
      reference: "/*",
      action: "append",
    },
  });

  return signer.getSignedXml();
}

function encryptElementContent(xml, elementName, publicKeyPem) {
  if (!xml || !elementName || !publicKeyPem) {
    throw new Error("xml, elementName, and publicKeyPem are required");
  }

  const document = new DOMParser().parseFromString(xml, "text/xml");
  const nodes = xpath.select(`//*[local-name(.)='${elementName}']`, document);
  const targetNode = nodes[0];

  if (!targetNode) {
    throw new Error(`Element ${elementName} not found`);
  }

  const content = serializeChildren(targetNode);
  const encryptedDataXml = buildEncryptedDataXml(content, publicKeyPem);

  while (targetNode.firstChild) {
    targetNode.removeChild(targetNode.firstChild);
  }

  const encryptedDocument = new DOMParser().parseFromString(
    encryptedDataXml,
    "text/xml",
  );
  targetNode.appendChild(encryptedDocument.documentElement);

  return new XMLSerializer().serializeToString(document);
}

function signAndEncryptXml(xml, options) {
  const { privateKeyPem, publicKeyPem, elementName } = options ?? {};
  const signedXml = signXml(xml, privateKeyPem);
  const signedEncryptedXml = encryptElementContent(
    signedXml,
    elementName,
    publicKeyPem,
  );

  return {
    signedXml,
    signedEncryptedXml,
  };
}

function decryptXml(xml, privateKeyPem) {
  if (!xml || !privateKeyPem) {
    throw new Error("xml and privateKeyPem are required");
  }

  const document = new DOMParser().parseFromString(xml, "text/xml");
  const encryptedDataNodes = xpath.select(
    "//*[local-name(.)='EncryptedData' and namespace-uri(.)='http://www.w3.org/2001/04/xmlenc#']",
    document,
  );
  const encryptedDataNode = encryptedDataNodes[0];

  if (!encryptedDataNode || !encryptedDataNode.parentNode) {
    throw new Error("EncryptedData element not found");
  }

  const wrappedKeyNode = xpath.select(
    ".//*[local-name(.)='EncryptedKey']/*[local-name(.)='CipherData']/*[local-name(.)='CipherValue']/text()",
    encryptedDataNode,
  )[0];
  const cipherPayloadNode = xpath.select(
    "./*[local-name(.)='CipherData']/*[local-name(.)='CipherValue']/text()",
    encryptedDataNode,
  )[0];

  if (!wrappedKeyNode || !cipherPayloadNode) {
    throw new Error("Encrypted key or cipher payload not found");
  }

  const wrappedKey = Buffer.from(String(wrappedKeyNode.data), "base64");
  const payload = Buffer.from(String(cipherPayloadNode.data), "base64");
  const sessionKey = privateDecrypt(
    {
      key: createPrivateKey(privateKeyPem),
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha1",
    },
    wrappedKey,
  );

  const iv = payload.subarray(0, 12);
  const authTag = payload.subarray(payload.length - 16);
  const encrypted = payload.subarray(12, payload.length - 16);
  const decipher = require("node:crypto").createDecipheriv(
    "aes-256-gcm",
    sessionKey,
    iv,
  );
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");

  const fragmentDocument = new DOMParser().parseFromString(
    `<root>${decrypted}</root>`,
    "text/xml",
  );
  const root = fragmentDocument.documentElement;
  const importedNodes = Array.from(root.childNodes ?? []);
  const parent = encryptedDataNode.parentNode;

  importedNodes.forEach((node) => {
    parent.insertBefore(node.cloneNode(true), encryptedDataNode);
  });
  parent.removeChild(encryptedDataNode);

  return new XMLSerializer().serializeToString(document);
}

function buildEncryptedDataXml(content, publicKeyPem) {
  const sessionKey = randomBytes(32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", sessionKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(content, "utf8")),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const cipherPayload = Buffer.concat([iv, encrypted, authTag]).toString(
    "base64",
  );
  const wrappedKey = publicEncrypt(
    {
      key: createPublicKey(publicKeyPem),
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha1",
    },
    sessionKey,
  ).toString("base64");

  return (
    `<xenc:EncryptedData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" Type="http://www.w3.org/2001/04/xmlenc#Content">` +
    `<xenc:EncryptionMethod Algorithm="http://www.w3.org/2009/xmlenc11#aes256-gcm"/>` +
    `<ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">` +
    `<xenc:EncryptedKey>` +
    `<xenc:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"/>` +
    `<xenc:CipherData><xenc:CipherValue>${wrappedKey}</xenc:CipherValue></xenc:CipherData>` +
    `</xenc:EncryptedKey>` +
    `</ds:KeyInfo>` +
    `<xenc:CipherData><xenc:CipherValue>${cipherPayload}</xenc:CipherValue></xenc:CipherData>` +
    `</xenc:EncryptedData>`
  );
}

function serializeChildren(node) {
  const serializer = new XMLSerializer();
  const parts = [];

  for (let index = 0; index < node.childNodes.length; index += 1) {
    parts.push(serializer.serializeToString(node.childNodes[index]));
  }

  return parts.join("");
}

module.exports = {
  signXml,
  encryptElementContent,
  signAndEncryptXml,
  decryptXml,
};
