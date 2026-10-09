import { Injectable } from '@nestjs/common';
import { NativeXmlService } from '../../common/services/native-xml.service';
import { VerificationRequestDto } from './dto/verification-request.dto';

@Injectable()
export class Acmt023NativeService {
  private readonly outputDirectory = 'acmt023-native';

  constructor(private readonly nativeXmlService: NativeXmlService) {}

  async generate(request: VerificationRequestDto) {
    const messageId = this.nativeXmlService.generateMessageId();
    const plainXml = this.nativeXmlService.createXml(
      'Document',
      'urn:iso:std:iso:20022:tech:xsd:acmt.023.001.04',
      this.buildBody(request, messageId),
    );
    const signedXml = await this.nativeXmlService.signXml(plainXml);
    const signedEncryptedXml =
      await this.nativeXmlService.encryptElementContent(
        signedXml,
        'IdVrfctnReq',
      );
    const artifacts = await this.nativeXmlService.persistArtifacts(
      this.outputDirectory,
      'acmt023-native',
      plainXml,
      signedXml,
      signedEncryptedXml,
    );

    return {
      messageId,
      messageType: 'acmt023',
      ...artifacts,
    };
  }

  private buildBody(request: VerificationRequestDto, messageId: string) {
    const institutionId = this.nativeXmlService.getInstitutionId();
    const creatorName = this.nativeXmlService.getCreatorName();

    return {
      IdVrfctnReq: {
        Assgnmt: {
          MsgId: messageId,
          CreDtTm: this.nativeXmlService.formatOffsetDateTime(new Date()),
          Cretr: {
            Pty: {
              Nm: creatorName,
            },
          },
          Assgnr: {
            Pty: {
              Nm: creatorName,
            },
            Agt: {
              FinInstnId: {
                BICFI: institutionId,
                ClrSysMmbId: {
                  MmbId: institutionId,
                },
              },
            },
          },
          Assgne: {
            Agt: {
              FinInstnId: {
                BICFI: request.beneficiaryId,
                ClrSysMmbId: {
                  MmbId: request.beneficiaryId,
                },
              },
            },
          },
        },
        Vrfctn: {
          Id: messageId,
          PtyAndAcctId: {
            Pty: {
              Nm: request.partyToVerifyName,
            },
            Acct: {
              Id: {
                IBAN: request.accountNumber,
              },
            },
          },
        },
      },
    };
  }
}
