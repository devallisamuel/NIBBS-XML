import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import {
  COUNTERPARTY_PUBLIC_KEY_PATH,
  LOCAL_PRIVATE_KEY_PATH,
  LOCAL_PUBLIC_KEY_PATH,
} from '../constants/message-artifact.constants';

export type PublicKeySource = 'local' | 'counterparty';

@Injectable()
export class KeyMaterialService {
  async getPrivateKeyPem(): Promise<string> {
    return readFile(LOCAL_PRIVATE_KEY_PATH, 'utf8');
  }

  async getPublicKeyPem(source: PublicKeySource): Promise<string> {
    const path =
      source === 'counterparty'
        ? COUNTERPARTY_PUBLIC_KEY_PATH
        : LOCAL_PUBLIC_KEY_PATH;

    return readFile(path, 'utf8');
  }
}
