import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginationResultDto } from './pagination-result.dto';

type Params<T> = {
  description?: string;
  type: T;
};

export const ApiOkPaginatedResponse = <T extends Type<unknown>>(
  params: Params<T>
): MethodDecorator =>
  applyDecorators(
    ApiExtraModels(PaginationResultDto, params.type),
    ApiOkResponse({
      description: params.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResultDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(params.type) }
              }
            }
          }
        ]
      }
    })
  );
