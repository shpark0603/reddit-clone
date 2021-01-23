import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private recursivelyTrimBody(obj: object) {
    for (const key in obj) {
      if (key === 'password') {
        continue;
      }

      if (this.isObject(obj[key])) {
        obj[key] = this.recursivelyTrimBody(obj[key]);
      } else if (typeof key === 'string') {
        obj[key] = obj[key].trim();
      }
    }

    return obj;
  }

  private isObject(value: any) {
    return typeof value === 'object' && value !== null;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && this.isObject(value)) {
      return this.recursivelyTrimBody(value);
    }
  }
}
