import { Injectable } from '@nestjs/common';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import {
  constants,
  createCipheriv,
  createPublicKey,
  publicEncrypt,
  randomBytes,
} from 'node:crypto';
import { create } from 'xmlbuilder2';
import { SignedXml } from 'xml-crypto';
import * as xpath from 'xpath';
import { GeneratedArtifactDto } from '../dto/generated-artifact.dto';
import { GeneratedMessageResponseDto } from '../dto/generated-message-response.dto';
import { KeyMaterialService } from './key-material.service';
import { LocalDebugArtifactService } from './local-debug-artifact.service';

type ArtifactSet = Pick<
  GeneratedMessageResponseDto,
  'plainXml' | 'signedXml' | 'signedEncryptedXml'
>;

@Injectable()
export class NativeXmlService {
  private readonly institutionId = process.env.INSTITUTION_ID ?? '000000';
  private readonly creatorName = process.env.CREATOR_NAME ?? 'Example Sender Institution';

  constructor(
    private readonly keyMaterialService: KeyMaterialService,
    private readonly localDebugArtifactService: LocalDebugArtifactService,
  ) {}

  getInstitutionId(): string {
    return this.institutionId;
  }

  getCreatorName(): string {
    return this.creatorName;
  }

  createXml(
    rootName: string,
    rootNamespace: string,
    body?: Record<string, unknown>,
  ): string {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele({
        [`ns2:${rootName}`]: {
          '@xmlns:ns2': rootNamespace,
          ...(body ?? {}),
        },
      })
      .end({ prettyPrint: true });
  }

  async signXml(xml: string): Promise<string> {
    const privateKeyPem = await this.keyMaterialService.getPrivateKeyPem();
    const signer = new SignedXml({ privateKey: privateKeyPem });

    signer.canonicalizationAlgorithm =
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
    signer.signatureAlgorithm =
      'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    signer.getKeyInfoContent = () => null;

    signer.addReference({
      xpath: '/*',
      transforms: ['http://www.w3.org/2000/09/xmldsig#enveloped-signature'],
      digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
      uri: '',
      isEmptyUri: true,
    });

    signer.computeSignature(xml, {
      location: {
        reference: '/*',
        action: 'append',
      },
    });

    return signer.getSignedXml();
  }

  async encryptElementContent(
    signedXml: string,
    rootTag: string,
  ): Promise<string> {
    const publicKeyPem =
      await this.keyMaterialService.getPublicKeyPem('counterparty');
    const document = new DOMParser().parseFromString(signedXml, 'text/xml');
    const nodes = xpath.select(
      `//*[local-name(.)='${rootTag}']`,
      document as unknown as Node,
    ) as Node[];
    const rootNode = nodes[0] as Node & {
      firstChild: Node | null;
      appendChild(node: Node): Node;
      removeChild(node: Node): Node;
    };

    if (!rootNode) {
      throw new Error(`${rootTag} element not found`);
    }

    const rootContent = this.serializeChildren(rootNode);
    const encryptedDataXml = this.buildEncryptedDataXml(
      rootContent,
      publicKeyPem,
    );

    while (rootNode.firstChild) {
      rootNode.removeChild(rootNode.firstChild);
    }

    const encryptedDoc = new DOMParser().parseFromString(
      encryptedDataXml,
      'text/xml',
    );
    const encryptedRoot =
      encryptedDoc.documentElement as unknown as Node | null;
    if (!encryptedRoot) {
      throw new Error('EncryptedData payload could not be parsed');
    }

    rootNode.appendChild(encryptedRoot);

    return new XMLSerializer().serializeToString(document);
  }

  async persistArtifacts(
    outputDirectory: string,
    fileStem: string,
    plainXml: string,
    signedXml: string,
    signedEncryptedXml: string,
  ): Promise<ArtifactSet> {
    const plainPath = await this.localDebugArtifactService.save(
      outputDirectory,
      `01-plain-${fileStem}`,
      plainXml,
    );
    const signedPath = await this.localDebugArtifactService.save(
      outputDirectory,
      `02-signed-${fileStem}`,
      signedXml,
    );
    const encryptedPath = await this.localDebugArtifactService.save(
      outputDirectory,
      `03-signed-encrypted-${fileStem}`,
      signedEncryptedXml,
    );

    return {
      plainXml: this.buildArtifact(plainPath, plainXml),
      signedXml: this.buildArtifact(signedPath, signedXml),
      signedEncryptedXml: this.buildArtifact(encryptedPath, signedEncryptedXml),
    };
  }

  buildResponse(
    messageId: string,
    messageType: string,
    artifacts: ArtifactSet,
  ): GeneratedMessageResponseDto {
    return {
      messageId,
      messageType,
      ...artifacts,
    };
  }

  generateMessageId(institutionId = this.institutionId): string {
    const now = new Date();
    const pad = (value: number | string, size = 2) =>
      `${value}`.padStart(size, '0');
    const timestamp =
      `${now.getFullYear()}` +
      `${pad(now.getMonth() + 1)}` +
      `${pad(now.getDate())}` +
      `${pad(now.getHours())}` +
      `${pad(now.getMinutes())}` +
      `${pad(now.getSeconds())}`;
    const remaining = 35 - institutionId.length - timestamp.length;
    const suffix = Array.from({ length: Math.max(0, remaining) }, () =>
      Math.floor(Math.random() * 10).toString(),
    ).join('');

    return `${institutionId}${timestamp}${suffix}`.slice(0, 35);
  }

  formatOffsetDateTime(date: Date): string {
    const pad = (value: number | string, size = 2) =>
      `${value}`.padStart(size, '0');
    const microseconds = `${date.getMilliseconds()}`.padStart(3, '0') + '000';
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absoluteOffsetMinutes = Math.abs(offsetMinutes);
    const offsetHours = pad(Math.floor(absoluteOffsetMinutes / 60));
    const offsetRemainderMinutes = pad(absoluteOffsetMinutes % 60);

    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
      `.${microseconds}${sign}${offsetHours}:${offsetRemainderMinutes}`
    );
  }

  private buildArtifact(path: string, content: string): GeneratedArtifactDto {
    return { path, content };
  }

  private buildEncryptedDataXml(content: string, publicKeyPem: string): string {
    const sessionKey = randomBytes(32);
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', sessionKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(content, 'utf8')),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    const cipherPayload = Buffer.concat([iv, encrypted, authTag]).toString(
      'base64',
    );
    const wrappedKey = publicEncrypt(
      {
        key: createPublicKey(publicKeyPem),
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha1',
      },
      sessionKey,
    ).toString('base64');

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

  private serializeChildren(
    node: Node & { childNodes: ArrayLike<Node> },
  ): string {
    const serializer = new XMLSerializer();
    const parts: string[] = [];

    for (let index = 0; index < node.childNodes.length; index += 1) {
      const childNode = node.childNodes[index];
      if (childNode) {
        parts.push(serializer.serializeToString(childNode as any));
      }
    }

    return parts.join('');
  }
}
