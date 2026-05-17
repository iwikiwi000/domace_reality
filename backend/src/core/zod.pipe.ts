import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (result.success) {
      return result.data;
    } else {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }
  }
}
