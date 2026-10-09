import { Injectable } from '@nestjs/common';
import { NativeXmlService } from '../../common/services/native-xml.service';
import { MandateAmendmentRequestDto } from './dto/mandate-amendment-request.dto';

@Injectable()
export class Pain010NativeService {
  private readonly outputDirectory = 'pain010-native';

  constructor(private readonly nativeXmlService: NativeXmlService) {}

  async generate(request: MandateAmendmentRequestDto) {
    const messageId = this.nativeXmlService.generateMessageId();
    const plainXml = this.nativeXmlService.createXml(
      'Document',
      'urn:iso:std:iso:20022:tech:xsd:pain.010.001.08',
      this.buildBody(request, messageId),
    );
    const signedXml = await this.nativeXmlService.signXml(plainXml);
    const signedEncryptedXml =
      await this.nativeXmlService.encryptElementContent(
        signedXml,
        'MndtAmdmntReq',
      );
    const artifacts = await this.nativeXmlService.persistArtifacts(
      this.outputDirectory,
      'pain010-native',
      plainXml,
      signedXml,
      signedEncryptedXml,
    );

    return this.nativeXmlService.buildResponse(messageId, 'pain010', artifacts);
  }

  private buildBody(request: MandateAmendmentRequestDto, messageId: string) {
    return {
      MndtAmdmntReq: {
        GrpHdr: {
          MsgId: messageId,
          CreDtTm: this.nativeXmlService.formatOffsetDateTime(new Date()),
          InitgPty: { Nm: request.initiatingPartyName },
        },
        UndrlygAmdmntDtls: {
          OrgnlMsgInf: {
            MsgId: request.originalMessageId,
            MsgNmId: 'pain.009.001.08',
            CreDtTm: request.originalCreationDateTime,
          },
          AmdmntRsn: {
            Rsn: {
              Cd: request.amendmentReasonCode,
              Prtry: request.amendmentReasonDescription,
            },
          },
          Mndt: {
            MndtId: request.mandateId,
            Ocrncs: {
              SeqTp: request.sequenceType,
              Frqcy: { Tp: request.frequencyType },
              FrstColltnDt: request.firstCollectionDate,
              FnlColltnDt: request.finalCollectionDate,
            },
            TrckgInd: request.trackingIndicator,
            Cdtr: { Nm: request.creditorName },
            CdtrAcct: {
              Id: { IBAN: request.creditorAccountNumber },
              Nm: request.creditorAccountName,
            },
            CdtrAgt: {
              FinInstnId: {
                BICFI: request.creditorAgentBIC,
                ClrSysMmbId: { MmbId: request.creditorAgentMemberId },
              },
            },
            Dbtr: { Nm: request.debtorName },
            DbtrAcct: {
              Id: { IBAN: request.debtorAccountNumber },
              Nm: request.debtorAccountName,
            },
            DbtrAgt: {
              FinInstnId: {
                BICFI: request.debtorAgentBIC,
                ClrSysMmbId: { MmbId: request.debtorAgentMemberId },
              },
            },
          },
          OrgnlMndt: {
            OrgnlMndtId: request.originalMandateId,
          },
        },
      },
    };
  }
}
