import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/common/auth/auth.module';
import { AwsModule } from 'src/common/aws/aws.module';
import { MessageController } from 'src/common/message/controllers/message.controller';
import { SettingController } from 'src/common/setting/controllers/setting.controller';
import { HealthController } from 'src/health/controllers/health.controller';
import { HealthModule } from 'src/health/health.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserController } from 'src/modules/user/controllers/user.controller';
import { UserModule } from 'src/modules/user/user.module';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { ApiKeyController } from 'src/common/api-key/controllers/api-key.controller';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';

@Module({
    controllers: [
        HealthController,
        SettingController,
        MessageController,
        UserController,
        ApiKeyController,
    ],
    providers: [],
    exports: [],
    imports: [
        AwsModule,
        TerminusModule,
        AuthModule,
        HealthModule,
        RoleModule,
        UserModule,
        PermissionModule,
        ApiKeyModule,
    ],
})
export class RoutesModule {}
