import { Inject, Injectable } from '@nestjs/common';
import { NativeXmlService } from '../../common/services/native-xml.service';
import { PaymentRequestDto } from './dto/payment-request.dto';

@Injectable()
export class Pacs008NativeService {
  private readonly outputDirectory = 'pacs008';

  constructor(
    @Inject(NativeXmlService) private readonly nativeXmlService: any,
  ) {}

  async generate(request: PaymentRequestDto) {
    const messageId = this.nativeXmlService.generateMessageId(
      request.instructingAgentBic,
    );
    const plainXml = this.nativeXmlService.createXml(
      'Document',
      'urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12',
      this.buildBody(request, messageId),
    );
    const signedXml = await this.nativeXmlService.signXml(plainXml);
    const signedEncryptedXml =
      await this.nativeXmlService.encryptElementContent(
        signedXml,
        'FIToFICstmrCdtTrf',
      );
    const artifacts = await this.nativeXmlService.persistArtifacts(
      this.outputDirectory,
      'pacs008',
      plainXml,
      signedXml,
      signedEncryptedXml,
    );

    return this.nativeXmlService.buildResponse(messageId, 'pacs008', artifacts);
  }

  private buildBody(request: PaymentRequestDto, messageId: string) {
    const creationDateTime = this.nativeXmlService.formatOffsetDateTime(
      new Date(),
    );
    const instructingMemberId = request.instructingAgentBic;
    const instructedMemberId = request.instructedAgentBic;

    return {
      FIToFICstmrCdtTrf: {
        GrpHdr: {
          MsgId: messageId,
          CreDtTm: creationDateTime,
          BtchBookg: 'false',
          NbOfTxs: '1',
          SttlmInf: {
            SttlmMtd: 'CLRG',
          },
          InstgAgt: {
            FinInstnId: {
              BICFI: request.instructingAgentBic,
              ClrSysMmbId: {
                MmbId: instructingMemberId,
              },
            },
          },
          InstdAgt: {
            FinInstnId: {
              BICFI: request.instructedAgentBic,
              ClrSysMmbId: {
                MmbId: instructedMemberId,
              },
            },
          },
        },
        CdtTrfTxInf: {
          PmtId: {
            InstrId: this.generateInstrId(
              instructingMemberId,
              request.instructedAgentBic,
            ),
            EndToEndId: this.generateEndToEndId(instructingMemberId),
            TxId: this.generateTxId(instructingMemberId),
          },
          PmtTpInf: {
            ClrChanl: request.clearingChannel,
            SvcLvl: {
              Prtry: request.serviceLevel,
            },
            LclInstrm: {
              Prtry: request.localInstrument,
            },
            CtgyPurp: {
              Prtry: request.categoryPurpose,
            },
          },
          IntrBkSttlmAmt: {
            '@Ccy': request.interbankSettlementCurrency,
            '#': request.interbankSettlementAmount,
          },
          IntrBkSttlmDt: request.interbankSettlementDate,
          ChrgBr: request.chargesBearer,
          InstgAgt: {
            FinInstnId: {
              BICFI: request.instructingAgentBic,
              ClrSysMmbId: {
                MmbId: instructingMemberId,
              },
            },
          },
          InstdAgt: {
            FinInstnId: {
              BICFI: request.instructedAgentBic,
              ClrSysMmbId: {
                MmbId: instructedMemberId,
              },
            },
          },
          Dbtr: {
            Nm: request.debtorName,
          },
          DbtrAcct: {
            Id: {
              IBAN: request.debtorAccountIban,
            },
            Nm: request.debtorAccountName,
          },
          DbtrAgt: {
            FinInstnId: {
              BICFI: request.instructingAgentBic,
              ClrSysMmbId: {
                MmbId: instructingMemberId,
              },
            },
          },
          CdtrAgt: {
            FinInstnId: {
              BICFI: request.instructedAgentBic,
              ClrSysMmbId: {
                MmbId: instructedMemberId,
              },
            },
          },
          Cdtr: {
            Nm: request.creditorName,
          },
          CdtrAcct: {
            Id: {
              IBAN: request.creditorAccountIban,
            },
            Nm: request.creditorAccountName,
          },
          InstrForNxtAgt: {
            InstrInf: request.debtorInstructionInfo,
          },
          RmtInf: {
            Ustrd: request.remittanceInformation,
          },
        },
        SplmtryData: {
          PlcAndNm: 'CustomData',
          Envlp: {
            CustomData: {
              DebtorInfo: {
                AccountDesignation: request.debtorAccountDesignation,
                IdType: request.debtorIdType,
                IdValue: request.debtorIdValue,
                AccountTier: request.debtorAccountTier,
              },
              CreditorInfo: {
                AccountDesignation: request.creditorAccountDesignation,
                IdType: request.creditorIdType,
                IdValue: request.creditorIdValue,
                AccountTier: request.creditorAccountTier,
              },
              TransactionInfo: {
                TransactionLocation: request.transactionLocation,
                NameEnquiryMsgId: request.nameEnquiryMsgId,
                ChannelCode: request.channelCode,
                RiskRating: request.riskRating,
              },
            },
          },
        },
      },
    };
  }

  private generateTxId(sourceId: string) {
    return this.generate35CharId(sourceId);
  }

  private generateEndToEndId(sourceId: string) {
    return `${sourceId}${this.randomDigits(35 - sourceId.length)}`.slice(0, 35);
  }

  private generateInstrId(sourceId: string, destId: string) {
    const now = new Date();
    const pad = (value: number) => `${value}`.padStart(2, '0');
    const datePart =
      `${now.getFullYear()}` +
      `${pad(now.getMonth() + 1)}` +
      `${pad(now.getDate())}` +
      `${pad(now.getHours())}` +
      `${pad(now.getMinutes())}` +
      `${pad(now.getSeconds())}`;

    return `${sourceId}${destId}${datePart}${this.randomDigits(9)}`.slice(
      0,
      35,
    );
  }

  private generate35CharId(sourceId: string) {
    return this.nativeXmlService.generateMessageId(sourceId);
  }

  private randomDigits(length: number) {
    return Array.from({ length: Math.max(0, length) }, () =>
      Math.floor(Math.random() * 10).toString(),
    ).join('');
  }
}
