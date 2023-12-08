import { IsNumber, Max, Min } from 'class-validator'

export class RectangleDto {
    @IsNumber()
    @Min(-90)
    @Max(90)
    minLatitude!: number

    @IsNumber()
    @Min(-180)
    @Max(180)
    minLongitude!: number

    @IsNumber()
    @Min(-90)
    @Max(90)
    maxLatitude!: number

    @IsNumber()
    @Min(-180)
    @Max(180)
    maxLongitude!: number
}
