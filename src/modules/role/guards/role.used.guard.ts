import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/constants/role.status-code.constant';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class RoleUsedGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __role } = context.switchToHttp().getRequest();
        const check: UserEntity = await this.userService.findOne(
            {
                role: __role._id,
            },
            {
                returnPlain: true,
            }
        );

        if (check) {
            throw new BadRequestException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_USED_ERROR,
                message: 'role.error.used',
            });
        }

        return true;
    }
}
