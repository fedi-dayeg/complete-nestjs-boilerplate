import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    ApiKeyDocParamsGet,
    ApiKeyDocQueryIsActive,
} from '@modules/api-key/constants/api-key.doc';
import { ApiKeyCreateSerialization } from '@modules/api-key/serializations/api-key.create.serialization';
import { ApiKeyGetSerialization } from '@modules/api-key/serializations/api-key.get.serialization';
import { ApiKeyListSerialization } from '@modules/api-key/serializations/api-key.list.serialization';
import { Doc, DocPaging } from '@common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from '@common/response/serializations/response.id.serialization';

export function ApiKeyListDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<ApiKeyListSerialization>('apiKey.list', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                queries: ApiKeyDocQueryIsActive,
            },
            response: {
                serialization: ApiKeyListSerialization,
            },
        })
    );
}

export function ApiKeyGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ApiKeyGetSerialization>('apiKey.get', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: ApiKeyDocParamsGet,
            },
            response: { serialization: ApiKeyGetSerialization },
        })
    );
}

export function ApiKeyCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ApiKeyCreateSerialization>('apiKey.create', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            response: {
                httpStatus: HttpStatus.CREATED,
                serialization: ApiKeyCreateSerialization,
            },
        })
    );
}

export function ApiKeyActiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('apiKey.active', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: ApiKeyDocParamsGet,
            },
        })
    );
}

export function ApiKeyInactiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('apiKey.inactive', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: ApiKeyDocParamsGet,
            },
        })
    );
}

export function ApiKeyResetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('apiKey.reset', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: ApiKeyDocParamsGet,
            },
            response: {
                serialization: ApiKeyCreateSerialization,
            },
        })
    );
}

export function ApiKeyUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('apiKey.update', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: ApiKeyDocParamsGet,
            },
            response: {
                serialization: ResponseIdSerialization,
            },
        })
    );
}
