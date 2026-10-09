import { Injectable } from '@nestjs/common';
import { NativeXmlService } from '../../common/services/native-xml.service';
import { DirectDebitInitiationRequestDto } from './dto/direct-debit-initiation-request.dto';

@Injectable()
export class Pain008NativeService {
  private readonly outputDirectory = 'pain008-native';

  constructor(private readonly nativeXmlService: NativeXmlService) {}

  async generate(request: DirectDebitInitiationRequestDto) {
    const messageId = this.nativeXmlService.generateMessageId();
    const endToEndId =
      request.endToEndId ??
      this.nativeXmlService.generateMessageId(request.debtorAgentMemberId);
    const paymentInformationId =
      request.paymentInformationId ??
      this.buildPaymentInformationId(request.requestedCollectionDate);
    const plainXml = this.nativeXmlService.createXml(
      'Document',
      'urn:iso:std:iso:20022:tech:xsd:pain.008.001.11',
      this.buildBody(request, messageId, paymentInformationId, endToEndId),
    );
    const signedXml = await this.nativeXmlService.signXml(plainXml);
    const signedEncryptedXml =
      await this.nativeXmlService.encryptElementContent(
        signedXml,
        'CstmrDrctDbtInitn',
      );
    const artifacts = await this.nativeXmlService.persistArtifacts(
      this.outputDirectory,
      'pain008-native',
      plainXml,
      signedXml,
      signedEncryptedXml,
    );

    return this.nativeXmlService.buildResponse(messageId, 'pain008', artifacts);
  }

  private buildBody(
    request: DirectDebitInitiationRequestDto,
    messageId: string,
    paymentInformationId: string,
    endToEndId: string,
  ) {
    const amount = this.normalizeAmount(request.amount);

    return {
      CstmrDrctDbtInitn: {
        GrpHdr: {
          MsgId: messageId,
          CreDtTm: this.nativeXmlService.formatOffsetDateTime(new Date()),
          NbOfTxs: '1',
          CtrlSum: amount,
          InitgPty: {
            Nm: request.initiatingPartyName,
          },
          ...(request.forwardingAgentBic
            ? {
                FwdgAgt: {
                  FinInstnId: {
                    BICFI: request.forwardingAgentBic,
                  },
                },
              }
            : {}),
        },
        PmtInf: {
          PmtInfId: paymentInformationId,
          PmtMtd: 'DD',
          NbOfTxs: '1',
          CtrlSum: amount,
          PmtTpInf: {
            SvcLvl: {
              Cd: request.serviceLevelCode,
            },
            LclInstrm: {
              Prtry: request.localInstrumentCode,
            },
            SeqTp: request.sequenceType,
          },
          ReqdColltnDt: request.requestedCollectionDate,
          Cdtr: {
            Nm: request.creditorName,
          },
          CdtrAcct: {
            Id: {
              IBAN: request.creditorAccountNumber,
            },
            Ccy: request.currencyCode,
          },
          CdtrAgt: {
            FinInstnId: {
              BICFI: request.creditorAgentBic,
              ClrSysMmbId: {
                MmbId: request.creditorAgentMemberId,
              },
            },
          },
          DrctDbtTxInf: {
            PmtId: {
              ...(request.instructionId
                ? {
                    InstrId: request.instructionId,
                  }
                : {}),
              EndToEndId: endToEndId,
            },
            InstdAmt: {
              '@Ccy': request.currencyCode,
              '#': amount,
            },
            DrctDbtTx: {
              MndtRltdInf: {
                MndtId: request.mandateId,
                DtOfSgntr: request.dateOfSignature,
                ...(request.firstCollectionDate
                  ? {
                      FrstColltnDt: request.firstCollectionDate,
                    }
                  : {}),
                ...(request.finalCollectionDate
                  ? {
                      FnlColltnDt: request.finalCollectionDate,
                    }
                  : {}),
                ...(request.frequencyType
                  ? {
                      Frqcy: {
                        Tp: request.frequencyType,
                      },
                    }
                  : {}),
              },
            },
            DbtrAgt: {
              FinInstnId: {
                ClrSysMmbId: {
                  MmbId: request.debtorAgentMemberId,
                },
              },
            },
            Dbtr: {
              Nm: request.debtorName,
            },
            DbtrAcct: {
              Id: {
                IBAN: request.debtorAccountNumber,
                Othr: {
                  Id:
                    request.otherAccountIdentifier ?? request.debtorAccountNumber,
                },
              },
              Ccy: request.currencyCode,
            },
            ...(request.remittanceInformation
              ? {
                  RmtInf: {
                    Ustrd: request.remittanceInformation,
                  },
                }
              : {}),
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
                BiometricData: request.debtorBiometricData ?? '',
              },
              CreditorInfo: {
                AccountDesignation: request.creditorAccountDesignation,
                IdType: request.creditorIdType,
                IdValue: request.creditorIdValue,
                AccountTier: request.creditorAccountTier,
              },
              CreditorMetadata: {},
              TransactionInfo: {
                TransactionLocation: request.transactionLocation,
                NameEnquiryMsgId: request.nameEnquiryMessageId,
                ChannelCode: request.channelCode,
                FixedCollectionAmount: request.fixedCollectionAmount,
                ...(request.mandateCode
                  ? {
                      MandateCode: request.mandateCode,
                    }
                  : {}),
              },
            },
          },
        },
      },
    };
  }

  private normalizeAmount(amount: string): string {
    return Number(amount).toFixed(2);
  }

  private buildPaymentInformationId(requestedCollectionDate: string): string {
    const normalizedDate = requestedCollectionDate
      .replace(/[^0-9]/g, '')
      .slice(0, 8);

    return `DD-${normalizedDate}-001-SINGLE`;
  }
}
