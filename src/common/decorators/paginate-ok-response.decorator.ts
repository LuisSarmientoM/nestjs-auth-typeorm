import { applyDecorators, Type } from '@nestjs/common'
import {
    ApiExtraModels,
    ApiOkResponse,
    ApiProperty,
    getSchemaPath,
} from '@nestjs/swagger'
export class PaginatedResponseDto<T> {
    @ApiProperty({
        type: [Object],
        description: 'List of items',
        isArray: true,
    })
    data: T[]
    @ApiProperty({
        type: Number,
        description: 'Total number of items',
    })
    count: number
}
export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
    dataDto: DataDto,
) =>
    applyDecorators(
        ApiExtraModels(PaginatedResponseDto, dataDto),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginatedResponseDto) },
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: { $ref: getSchemaPath(dataDto) },
                            },
                        },
                    },
                ],
            },
            description: 'List of items paginated',
        }),
    )
