import { applyDecorators } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { SettingDocParamsGet } from 'src/common/setting/constants/setting.doc.constant';

export function SettingUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('setting.update', {
            auth: {
                jwtAccessToken: true,
                permissionToken: true,
            },
            request: {
                params: SettingDocParamsGet,
            },
            response: { serialization: ResponseIdSerialization },
        })
    );
}
