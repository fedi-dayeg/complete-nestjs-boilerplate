import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
    RoleDoc,
    RoleEntity,
} from 'src/modules/role/repository/entities/role.entity';

export const GetRole = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): RoleDoc | RoleEntity => {
        const { __role } = ctx.switchToHttp().getRequest();
        return returnPlain ? __role.toObject() : __role;
    }
);
