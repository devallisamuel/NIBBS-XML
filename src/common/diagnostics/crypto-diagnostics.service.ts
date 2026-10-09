import { Injectable } from '@nestjs/common';
import { CryptoDiagnosticsRequestDto } from './dto/crypto-diagnostics-request.dto';
import { DecryptXmlRequestDto } from './dto/decrypt-xml-request.dto';
import { SignatureValidationRequestDto } from './dto/signature-validation-request.dto';
import { XmlCryptoService } from '../services/xml-crypto.service';

@Injectable()
export class CryptoDiagnosticsService {
  constructor(private readonly xmlCryptoService: XmlCryptoService) {}

  validateSignature(request: SignatureValidationRequestDto) {
    return this.xmlCryptoService.verifySignature(
      request.xml,
      request.keySource ?? 'local',
      request.persistArtifacts ?? false,
      request.artifactLabel ?? 'signature-verification',
    );
  }

  decryptXml(request: DecryptXmlRequestDto) {
    return this.xmlCryptoService.decryptXml(
      request.xml,
      request.validateSignatureAfterDecrypt ?? false,
      request.signatureKeySource ?? 'local',
      request.persistArtifacts ?? false,
      request.artifactLabel ?? 'decrypted-xml',
    );
  }

  async diagnose(request: CryptoDiagnosticsRequestDto) {
    let xmlForSignature = request.xml;
    let decryption;

    if (request.attemptDecrypt) {
      decryption = await this.xmlCryptoService.decryptXml(
        request.xml,
        false,
        request.signatureKeySource ?? 'local',
        request.persistArtifacts ?? false,
        request.artifactLabel ?? 'crypto-diagnostics',
      );
      xmlForSignature = decryption.decryptedXml;
    }

    const signatureValidation = await this.xmlCryptoService.verifySignature(
      xmlForSignature,
      request.signatureKeySource ?? 'local',
      request.persistArtifacts ?? false,
      `${request.artifactLabel ?? 'crypto-diagnostics'}-signature`,
    );

    return {
      signatureValidation,
      decryption,
    };
  }
}
