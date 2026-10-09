import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NEST_DEBUG_OUTPUT_DIR } from '../constants/message-artifact.constants';

@Injectable()
export class LocalDebugArtifactService {
  async save(
    subdirectory: string,
    filePrefix: string,
    content: string,
  ): Promise<string> {
    const directory = join(NEST_DEBUG_OUTPUT_DIR, subdirectory);
    await mkdir(directory, { recursive: true });

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '_');

    const path = join(directory, `${filePrefix}-${timestamp}.xml`);
    await writeFile(path, content, 'utf8');
    return path;
  }
}
