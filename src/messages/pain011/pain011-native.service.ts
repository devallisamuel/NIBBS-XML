import { Injectable } from '@nestjs/common';
import { NativeXmlService } from '../../common/services/native-xml.service';
import { MandateCancellationRequestDto } from './dto/mandate-cancellation-request.dto';

@Injectable()
export class Pain011NativeService {
  private readonly outputDirectory = 'pain011-native';

  constructor(private readonly nativeXmlService: NativeXmlService) {}

  async generate(request: MandateCancellationRequestDto) {
    const messageId = this.nativeXmlService.generateMessageId();
    const plainXml = this.nativeXmlService.createXml(
      'Document',
      'urn:iso:std:iso:20022:tech:xsd:pain.011.001.08',
      this.buildBody(request, messageId),
    );
    const signedXml = await this.nativeXmlService.signXml(plainXml);
    const signedEncryptedXml =
      await this.nativeXmlService.encryptElementContent(
        signedXml,
        'MndtCxlReq',
      );
    const artifacts = await this.nativeXmlService.persistArtifacts(
      this.outputDirectory,
      'pain011-native',
      plainXml,
      signedXml,
      signedEncryptedXml,
    );

    return this.nativeXmlService.buildResponse(messageId, 'pain011', artifacts);
  }

  private buildBody(request: MandateCancellationRequestDto, messageId: string) {
    return {
      MndtCxlReq: {
        GrpHdr: {
          MsgId: messageId,
          CreDtTm: this.nativeXmlService.formatOffsetDateTime(new Date()),
        },
        UndrlygCxlDtls: {
          OrgnlMsgInf: {
            MsgId: request.originalMessageId,
            MsgNmId: 'pain.009.001.08',
            CreDtTm: request.originalCreationDateTime,
          },
          CxlRsn: {
            Rsn: {
              Cd: request.cancellationReasonCode,
              Prtry: request.cancellationReasonDescription,
            },
          },
          OrgnlMndt: {
            OrgnlMndtId: request.originalMandateId,
            OrgnlMndt: {
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
          },
        },
      },
    };
  }
}
