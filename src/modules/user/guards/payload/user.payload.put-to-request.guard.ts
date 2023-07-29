import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { user } = request;

        const check: UserDoc = await this.userService.findOneById(user._id, {
            join: true,
        });
        request.__user = check;

        return true;
    }
}
