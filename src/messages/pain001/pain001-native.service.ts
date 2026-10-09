import { Injectable } from '@nestjs/common';
import { NativeXmlService } from '../../common/services/native-xml.service';
import { PaymentInitiationRequestDto } from './dto/payment-initiation-request.dto';

@Injectable()
export class Pain001NativeService {
  private readonly outputDirectory = 'pain001-native';

  constructor(private readonly nativeXmlService: NativeXmlService) {}

  async generate(request: PaymentInitiationRequestDto) {
    const schemeCode = request.schemeCode;
    const messageId = this.nativeXmlService.generateMessageId();
    const endToEndId =
      request.endToEndId ?? this.nativeXmlService.generateMessageId(schemeCode);
    const paymentInformationId =
      request.paymentInformationId ??
      this.buildPaymentInformationId(request.requestedExecutionDate);
    const plainXml = this.nativeXmlService.createXml(
      'Document',
      'urn:iso:std:iso:20022:tech:xsd:pain.001.001.12',
      this.buildBody(
        request,
        schemeCode,
        messageId,
        paymentInformationId,
        endToEndId,
      ),
    );
    const signedXml = await this.nativeXmlService.signXml(plainXml);
    const signedEncryptedXml =
      await this.nativeXmlService.encryptElementContent(
        signedXml,
        'CstmrCdtTrfInitn',
      );
    const artifacts = await this.nativeXmlService.persistArtifacts(
      this.outputDirectory,
      'pain001-native',
      plainXml,
      signedXml,
      signedEncryptedXml,
    );

    return this.nativeXmlService.buildResponse(messageId, 'pain001', artifacts);
  }

  private buildBody(
    request: PaymentInitiationRequestDto,
    schemeCode: string,
    messageId: string,
    paymentInformationId: string,
    endToEndId: string,
  ) {
    const amount = this.normalizeAmount(request.amount);

    return {
      CstmrCdtTrfInitn: {
        GrpHdr: {
          MsgId: messageId,
          CreDtTm: this.nativeXmlService.formatOffsetDateTime(new Date()),
          NbOfTxs: '1',
          CtrlSum: amount,
          InitgPty: {
            Nm: request.initiatingPartyName,
            Id: {
              OrgId: {
                Othr: {
                  SchmeNm: {
                    Cd: schemeCode,
                  },
                },
              },
            },
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
          PmtMtd: 'TRF',
          BtchBookg: request.batchBooking,
          NbOfTxs: '1',
          CtrlSum: amount,
          ReqdExctnDt: {
            Dt: request.requestedExecutionDate,
          },
          Dbtr: {
            Nm: request.debtorName,
          },
          DbtrAcct: {
            Id: {
              IBAN: request.debtorAccountNumber,
            },
            Nm: request.debtorAccountName,
          },
          DbtrAgt: {
            FinInstnId: {
              BICFI: request.debtorAgentBic,
              ClrSysMmbId: {
                MmbId: request.debtorAgentMemberId,
              },
            },
          },
          ChrgBr: request.chargeBearerType,
          CdtTrfTxInf: {
            PmtId: {
              EndToEndId: endToEndId,
            },
            Amt: {
              InstdAmt: {
                '@Ccy': request.currencyCode,
                '#': amount,
              },
            },
            CdtrAgt: {
              FinInstnId: {
                BICFI: request.creditorAgentBic,
                ClrSysMmbId: {
                  MmbId: request.creditorAgentMemberId,
                },
              },
            },
            Cdtr: {
              Nm: request.creditorName,
            },
            CdtrAcct: {
              Id: {
                IBAN: request.creditorAccountNumber,
              },
              Nm: request.creditorAccountName,
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
              CreditorInfo: {
                AccountDesignation: request.creditorAccountDesignation,
                IdType: request.creditorIdType,
                IdValue: request.creditorIdValue,
                AccountTier: request.creditorAccountTier,
              },
              TransactionInfo: {
                TransactionLocation: request.transactionLocation,
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

  private buildPaymentInformationId(requestedExecutionDate: string): string {
    const normalizedDate = requestedExecutionDate.replace(/[^0-9]/g, '').slice(0, 8);

    return `PMT-${normalizedDate}-001-SINGLE`;
  }
}
