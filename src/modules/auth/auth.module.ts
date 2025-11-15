import { Module } from '@nestjs/common';
import { AuthJwtAccessStrategy } from '@modules/auth/guards/jwt-access/auth.jwt-access.strategy';
import { AuthJwtRefreshStrategy } from '@modules/auth/guards/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService } from '@modules/auth/services/auth.service';

@Module({
    providers: [AuthService, AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
    exports: [AuthService],
    controllers: [],
    imports: [],
})
export class AuthModule {}
