import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'

export class PaginationParamsDto {
    @ApiProperty({
        description: 'Number of items to skip (page). Default: 0',
        required: false,
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    public offset: number = 0

    @ApiProperty({
        required: false,
        description: `Number of items per page. Default: 10`,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    public limit: number = 10
}
