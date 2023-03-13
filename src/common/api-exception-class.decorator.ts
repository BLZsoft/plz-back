// FIXME: https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/issues/52

import { ApiException as ApiExceptionBase } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { HttpException, Type } from '@nestjs/common';

type Exception<T extends HttpException> = Type<T> | T;
type ExceptionOrExceptionArrayFunc<T extends HttpException> = () =>
  | Exception<T>
  | Exception<T>[];

export function ApiExceptionFix<T extends HttpException>(
  exceptions: ExceptionOrExceptionArrayFunc<T>,
  options?: { description: string }
) {
  return function (
    target: new (...params: any[]) => T,
    propertyKey?: string,
    descriptor?: PropertyDescriptor
  ): void {
    // Method decorator
    if (propertyKey && descriptor) {
      ApiExceptionBase(exceptions, options)(target, propertyKey, descriptor);
      return;
    }

    // Class decorator
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
