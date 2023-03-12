// FIXME: https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/issues/52

import { ApiException as ApiExceptionBase } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { HttpException, Type } from '@nestjs/common';

type Exception<T extends HttpException> = Type<T> | T;
type ExceptionOrExceptionArrayFunc<T extends HttpException> = () =>
  | Exception<T>
  | Exception<T>[];

export function ApiExceptionClass<T extends HttpException>(
  exceptions: ExceptionOrExceptionArrayFunc<T>,
  options?: { description: string }
) {
  return function (target: new (...params: any[]) => T): void {
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      const methodDescriptor = Object.getOwnPropertyDescriptor(
        target.prototype,
        key
      );

      if (methodDescriptor) {
        ApiExceptionBase(exceptions, options)(target, key, methodDescriptor);
        Object.defineProperty(target.prototype, key, methodDescriptor);
      }
    }
  };
}
