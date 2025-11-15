import { OmitType } from '@nestjs/swagger';
import { ApiKeyGetSerialization } from '@modules/api-key/serializations/api-key.get.serialization';

export class ApiKeyListSerialization extends OmitType(ApiKeyGetSerialization, [
    'description',
] as const) {}
