import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'

import { PaginationParamsDto } from './pagination.dto'

export class SearchPaginatedDto extends IntersectionType(PaginationParamsDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => String)
    term: string = ''
}
