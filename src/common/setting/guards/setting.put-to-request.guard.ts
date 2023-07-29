import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SettingDoc } from 'src/common/setting/repository/entities/setting.entity';
import { SettingService } from 'src/common/setting/services/setting.service';

@Injectable()
export class SettingPutToRequestGuard implements CanActivate {
    constructor(private readonly settingService: SettingService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { setting } = params;

        const check: SettingDoc = await this.settingService.findOneById(
            setting
        );
        request.__setting = check;

        return true;
    }
}

@Injectable()
export class SettingPutToRequestByNameGuard implements CanActivate {
    constructor(private readonly settingService: SettingService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { settingName } = params;

        const check: SettingDoc = await this.settingService.findOneByName(
            settingName
        );
        request.__setting = check;

        return true;
    }
}
