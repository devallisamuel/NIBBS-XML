import { Injectable } from '@nestjs/common';
import { diffLines } from 'diff';
import { ArtifactComparisonDto } from '../dto/artifact-comparison.dto';

@Injectable()
export class XmlComparisonService {
  compare(left: string, right: string): ArtifactComparisonDto {
    if (left === right) {
      return { matches: true };
    }

    const diffPreview = diffLines(left, right)
      .slice(0, 8)
      .map((part) => {
        const prefix = part.added ? '+' : part.removed ? '-' : ' ';
        return `${prefix} ${part.value}`.trimEnd();
      })
      .join('\n')
      .slice(0, 4000);

    return {
      matches: false,
      diffPreview,
    };
  }
}
