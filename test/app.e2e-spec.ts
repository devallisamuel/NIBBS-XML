import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('NIBSS API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      service: 'nibss-compatibility-bridge',
    });
  });

  it('POST /api/messages/acmt023/generate-native', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/messages/acmt023/generate-native')
      .send({
        beneficiaryId: '999997',
        partyToVerifyName: 'Ponmile Joy',
        accountNumber: '3157417712',
        destinationBankInstitution: '999997',
      })
      .expect(201);

    expect(response.body.messageType).toBe('acmt023-native');
    expect(response.body.messageId).toMatch(/^000000\d{29}$/);
    expect(response.body.plainXml.path).toContain('acmt023-native');
    expect(response.body.signedXml.content).toContain('<Signature ');
    expect(response.body.signedEncryptedXml.content).toContain(
      '<xenc:EncryptedData',
    );
  });

  it('POST /api/messages/pain009/generate-compare', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/messages/pain009/generate-compare')
      .send({
        mandateId: 'MND-000000-999997-007',
        sequenceType: 'OOFF',
        frequencyType: 'MNTH',
        firstCollectionDate: '2026-06-20',
        finalCollectionDate: '2026-12-20',
        trackingIndicator: true,
        collectionAmount: '1000.00',
        collectionCurrency: 'NGN',
        creditorName: 'Example Sender Institution',
        creditorAccountNumber: '1234567890',
        creditorAccountName: 'Example Sender Institution',
        creditorAgentBIC: '000000',
        creditorAgentMemberId: '000000',
        debtorName: 'Ponmile Joy',
        debtorAccountNumber: '3157417712',
        debtorAccountName: 'Ponmile Joy',
        debtorAgentBIC: '999997',
        debtorAgentMemberId: '999997',
        documentTypeCode: 'MSIN',
        documentNumber: 'DOC-000000-007',
        debtorAccountDesignation: '1',
        debtorIdType: 'BVN',
        debtorIdValue: '11111111145',
        debtorAccountTier: '1',
        debtorBiometricData: 'N/A',
        debtorAddressLine: 'Lagos Nigeria',
        debtorPhoneNumber: '08012345678',
        debtorEmailAddress: 'ponmile.joy@example.com',
        creditorAccountDesignation: '1',
        creditorIdType: 'BVN',
        creditorIdValue: '11111111145',
        creditorAccountTier: '1',
        transactionLocation: 'Lagos',
        channelCode: '4',
        mandateCategory: '0',
        fixedCollectionAmount: false,
      })
      .expect(201);

    expect(response.body.bridge.messageType).toBe('pain009');
    expect(response.body.native.messageType).toBe('pain009-native');
    expect(response.body.plainXml).toHaveProperty('matches');
    expect(response.body.signedXml).toHaveProperty('matches');
    expect(response.body.signedEncryptedXml).toHaveProperty('matches');
  });
});
