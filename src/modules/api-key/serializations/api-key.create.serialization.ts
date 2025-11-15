import { ApiProperty, PickType } from '@nestjs/swagger';
import { ApiKeyGetSerialization } from '@modules/api-key/serializations/api-key.get.serialization';

export class ApiKeyCreateSerialization extends PickType(
    ApiKeyGetSerialization,
    ['key', '_id'] as const
) {
    @ApiProperty({
        description: 'Secret key of ApiKey, only show at once',
        example: true,
        required: true,
    })
    secret: string;
}
