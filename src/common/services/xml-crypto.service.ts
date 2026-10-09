import { BadRequestException, Injectable } from '@nestjs/common';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { createPublicKey } from 'node:crypto';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { SignedXml } from 'xml-crypto';
import * as xmlenc from 'xml-encryption';
import * as xpath from 'xpath';
import { DecryptXmlResponseDto } from '../dto/decrypt-xml-response.dto';
import { SignatureValidationResponseDto } from '../dto/signature-validation-response.dto';
import { KeyMaterialService, PublicKeySource } from './key-material.service';
import { LocalDebugArtifactService } from './local-debug-artifact.service';

const execFileAsync = promisify(execFile);

type SignedXmlWithValidationErrors = SignedXml & {
  validationErrors?: string[];
};

@Injectable()
export class XmlCryptoService {
  constructor(
    private readonly keyMaterialService: KeyMaterialService,
    private readonly localDebugArtifactService: LocalDebugArtifactService,
  ) {}

  async verifySignature(
    xml: string,
    keySource: PublicKeySource,
    persistArtifacts = false,
    artifactLabel = 'signature-verification',
  ): Promise<SignatureValidationResponseDto> {
    const publicKeyPem =
      await this.keyMaterialService.getPublicKeyPem(keySource);
    const document = new DOMParser().parseFromString(xml, 'text/xml');
    const signatureNodes = xpath.select(
      "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']",
      document as unknown as Node,
    ) as Node[];

    if (!signatureNodes[0]) {
      return {
        isValid: false,
        keySource,
        errors: ['Cannot find Signature element'],
      };
    }

    const persistedArtifactPath = persistArtifacts
      ? await this.localDebugArtifactService.save(
          'signature-verification',
          artifactLabel,
          xml,
        )
      : undefined;

    const xmlSecResult = await this.verifyWithXmlSec(xml, publicKeyPem);

    if (xmlSecResult.isValid) {
      return {
        isValid: true,
        keySource,
        errors: [],
        persistedArtifactPath,
      };
    }

    const fallbackErrors = await this.verifyWithXmlCryptoFallback(
      xml,
      publicKeyPem,
    );

    return {
      isValid: false,
      keySource,
      errors: [...xmlSecResult.errors, ...fallbackErrors],
      persistedArtifactPath,
    };
  }

  async decryptXml(
    xml: string,
    validateSignatureAfterDecrypt = false,
    signatureKeySource: PublicKeySource = 'local',
    persistArtifacts = false,
    artifactLabel = 'decrypted-xml',
  ): Promise<DecryptXmlResponseDto> {
    const privateKeyPem = await this.keyMaterialService.getPrivateKeyPem();
    const decryptedFragment = await new Promise<string>((resolve, reject) => {
      xmlenc.decrypt(
        xml,
        {
          key: privateKeyPem,
          disallowDecryptionWithInsecureAlgorithm: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        },
      );
    }).catch((error: Error) => {
      throw new BadRequestException({
        message:
          'Unable to decrypt XML with the configured local private key. This commonly means the XML was encrypted for a different recipient.',
        error: error.message,
      });
    });

    const decryptedXml = this.replaceEncryptedDataWithDecryptedContent(
      xml,
      decryptedFragment,
    );
    const persistedArtifactPath = persistArtifacts
      ? await this.localDebugArtifactService.save(
          'decryption',
          artifactLabel,
          decryptedXml,
        )
      : undefined;

    const response: DecryptXmlResponseDto = {
      decryptedXml,
      persistedArtifactPath,
    };

    if (validateSignatureAfterDecrypt) {
      response.signatureValidation = await this.verifySignature(
        decryptedXml,
        signatureKeySource,
        persistArtifacts,
        `${artifactLabel}-signature`,
      );
    }

    return response;
  }

  private replaceEncryptedDataWithDecryptedContent(
    originalXml: string,
    decryptedFragment: string,
  ): string {
    const document = new DOMParser().parseFromString(originalXml, 'text/xml');
    const encryptedDataNodes = xpath.select(
      "//*[local-name(.)='EncryptedData' and namespace-uri(.)='http://www.w3.org/2001/04/xmlenc#']",
      document as unknown as Node,
    ) as Node[];
    const encryptedDataNode = encryptedDataNodes[0] as Node & {
      parentNode:
        | (Node & {
            insertBefore(newChild: Node, refChild: Node | null): Node;
            removeChild(child: Node): Node;
          })
        | null;
    };

    if (!encryptedDataNode || !encryptedDataNode.parentNode) {
      return decryptedFragment;
    }

    const fragmentDocument = new DOMParser().parseFromString(
      `<root>${decryptedFragment}</root>`,
      'text/xml',
    );
    const root = fragmentDocument.documentElement as unknown as Element & {
      childNodes: ArrayLike<Node>;
    };
    const importedNodes = Array.from(root?.childNodes ?? []);
    const parent = encryptedDataNode.parentNode;

    importedNodes.forEach((node) => {
      parent.insertBefore(node.cloneNode(true), encryptedDataNode);
    });
    parent.removeChild(encryptedDataNode);

    return new XMLSerializer().serializeToString(document);
  }

  private async verifyWithXmlSec(xml: string, publicKeyPem: string) {
    const directory = await mkdtemp(join(tmpdir(), 'nibss-xmlsec-'));
    const xmlPath = join(directory, 'signature.xml');
    const keyPath = join(directory, 'key.pem');

    await writeFile(xmlPath, xml, 'utf8');
    await writeFile(keyPath, publicKeyPem, 'utf8');

    try {
      await execFileAsync('xmlsec1', [
        '--verify',
        '--lax-key-search',
        '--pubkey-pem',
        keyPath,
        xmlPath,
      ]);

      return { isValid: true, errors: [] as string[] };
    } catch (error) {
      const processError = error as { stdout?: string; stderr?: string };
      const stderr =
        `${processError.stdout ?? ''}\n${processError.stderr ?? ''}`.trim();

      return {
        isValid: false,
        errors: stderr ? [stderr] : ['xmlsec1 verification failed'],
      };
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }

  private async verifyWithXmlCryptoFallback(
    xml: string,
    publicKeyPem: string,
  ): Promise<string[]> {
    const document = new DOMParser().parseFromString(xml, 'text/xml');
    const signatureNodes = xpath.select(
      "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']",
      document as unknown as Node,
    ) as Node[];
    const signatureNode = signatureNodes[0];

    try {
      const verifier = new SignedXml({
        publicCert: this.publicKeyPemToCert(publicKeyPem),
      }) as SignedXmlWithValidationErrors;

      verifier.loadSignature(signatureNode);
      const isValid = verifier.checkSignature(xml);

      if (isValid) {
        return [];
      }

      const validationErrors = verifier.validationErrors ?? [];
      return validationErrors.length > 0
        ? validationErrors
        : ['xml-crypto fallback verification returned false'];
    } catch (error) {
      return [
        error instanceof Error
          ? error.message
          : 'xml-crypto fallback verification failed',
      ];
    }
  }

  private publicKeyPemToCert(publicKeyPem: string): string {
    const publicKey = createPublicKey(publicKeyPem);

    return publicKey.export({
      type: 'spki',
      format: 'pem',
    }) as string;
  }
}
