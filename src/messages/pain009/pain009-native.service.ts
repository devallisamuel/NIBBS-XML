import { Injectable } from '@nestjs/common';
import { NativeXmlService } from '../../common/services/native-xml.service';
import { MandateInitiationRequestDto } from './dto/mandate-initiation-request.dto';

@Injectable()
export class Pain009NativeService {
  private readonly outputDirectory = 'pain009-native';

  constructor(private readonly nativeXmlService: NativeXmlService) {}

  async generate(request: MandateInitiationRequestDto) {
    const messageId = this.nativeXmlService.generateMessageId();
    const plainXml = this.nativeXmlService.createXml(
      'Document',
      'urn:iso:std:iso:20022:tech:xsd:pain.009.001.08',
      this.buildBody(request, messageId),
    );
    const signedXml = await this.nativeXmlService.signXml(plainXml);
    const signedEncryptedXml =
      await this.nativeXmlService.encryptElementContent(
        signedXml,
        'MndtInitnReq',
      );
    const artifacts = await this.nativeXmlService.persistArtifacts(
      this.outputDirectory,
      'pain009-native',
      plainXml,
      signedXml,
      signedEncryptedXml,
    );

    return this.nativeXmlService.buildResponse(messageId, 'pain009', artifacts);
  }

  private buildBody(request: MandateInitiationRequestDto, messageId: string) {
    return {
      MndtInitnReq: {
        GrpHdr: {
          MsgId: messageId,
          CreDtTm: this.nativeXmlService.formatOffsetDateTime(new Date()),
        },
        Mndt: {
          MndtId: request.mandateId,
          Ocrncs: {
            SeqTp: request.sequenceType,
            Frqcy: {
              Tp: request.frequencyType,
            },
            FrstColltnDt: request.firstCollectionDate,
            FnlColltnDt: request.finalCollectionDate,
          },
          TrckgInd: request.trackingIndicator,
          ColltnAmt: {
            '@Ccy': request.collectionCurrency,
            '#': request.collectionAmount,
          },
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
          RfrdDoc: {
            Tp: {
              CdOrPrtry: { Cd: request.documentTypeCode },
            },
            Nb: request.documentNumber,
          },
        },
        SplmtryData: {
          PlcAndNm: 'AdditionalVerificationDetails',
          Envlp: {
            CustomData: {
              DebtorInfo: {
                AccountDesignation: request.debtorAccountDesignation,
                IdType: request.debtorIdType,
                IdValue: request.debtorIdValue,
                AccountTier: request.debtorAccountTier,
              },
              DebtorMetadata: {
                BiometricData: request.debtorBiometricData,
                AdrLine: request.debtorAddressLine,
                PhneNb: request.debtorPhoneNumber,
                EmailAdr: request.debtorEmailAddress,
              },
              CreditorInfo: {
                AccountDesignation: request.creditorAccountDesignation,
                IdType: request.creditorIdType,
                IdValue: request.creditorIdValue,
                AccountTier: request.creditorAccountTier,
              },
              TransactionInfo: {
                TransactionLocation: request.transactionLocation,
                ChannelCode: request.channelCode,
                MandateCategory: request.mandateCategory,
                FixedCollectionAmount: request.fixedCollectionAmount,
              },
            },
          },
        },
      },
    };
  }
}
