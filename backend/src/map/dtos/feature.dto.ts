// DTO for creating a feature
import { PartialType } from '@nestjs/swagger'
import { IsNumber, IsObject, IsString, Max, Min } from 'class-validator'

export class CreateFeatureDto {
    @IsString()
    name!: string

    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude!: number

    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude!: number

    @IsObject()
    properties?: object
}

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {}
