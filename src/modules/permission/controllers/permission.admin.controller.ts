import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Patch,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ENUM_AUTH_PERMISSIONS } from 'src/common/auth/constants/auth.enum.permission.constant';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { AuthPermissionProtected } from 'src/common/auth/decorators/auth.permission.decorator';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import {
    PaginationQuery,
    PaginationQueryFilterInBoolean,
    PaginationQueryFilterInEnum,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ENUM_PERMISSION_GROUP } from 'src/modules/permission/constants/permission.enum.constant';
import {
    PERMISSION_DEFAULT_AVAILABLE_ORDER_BY,
    PERMISSION_DEFAULT_AVAILABLE_SEARCH,
    PERMISSION_DEFAULT_GROUP,
    PERMISSION_DEFAULT_IS_ACTIVE,
    PERMISSION_DEFAULT_ORDER_BY,
    PERMISSION_DEFAULT_ORDER_DIRECTION,
    PERMISSION_DEFAULT_PER_PAGE,
} from 'src/modules/permission/constants/permission.list.constant';
import {
    PermissionGetGuard,
    PermissionUpdateActiveGuard,
    PermissionUpdateGuard,
    PermissionUpdateInactiveGuard,
} from 'src/modules/permission/decorators/permission.admin.decorator';
import { GetPermission } from 'src/modules/permission/decorators/permission.decorator';
import {
    PermissionActiveDoc,
    PermissionGetDoc,
    PermissionGroupDoc,
    PermissionInactiveDoc,
    PermissionListDoc,
    PermissionUpdateDoc,
} from 'src/modules/permission/docs/permission.admin.doc';
import { PermissionUpdateDescriptionDto } from 'src/modules/permission/dtos/permission.update-description.dto';
import { PermissionRequestDto } from 'src/modules/permission/dtos/permissions.request.dto';
import { IPermissionGroup } from 'src/modules/permission/interfaces/permission.interface';
import {
    PermissionDoc,
    PermissionEntity,
} from 'src/modules/permission/repository/entities/permission.entity';
import { PermissionGetSerialization } from 'src/modules/permission/serializations/permission.get.serialization';
import { PermissionGroupsSerialization } from 'src/modules/permission/serializations/permission.group.serialization';
import { PermissionListSerialization } from 'src/modules/permission/serializations/permission.list.serialization';
import { PermissionService } from 'src/modules/permission/services/permission.service';

@ApiTags('modules.admin.permission')
@Controller({
    version: '1',
    path: '/permission',
})
export class PermissionAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly permissionService: PermissionService
    ) {}

    @PermissionListDoc()
    @ResponsePaging('permission.list', {
        serialization: PermissionListSerialization,
    })
    @AuthPermissionProtected(ENUM_AUTH_PERMISSIONS.PERMISSION_READ)
    @AuthJwtAdminAccessProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            PERMISSION_DEFAULT_PER_PAGE,
            PERMISSION_DEFAULT_ORDER_BY,
            PERMISSION_DEFAULT_ORDER_DIRECTION,
            PERMISSION_DEFAULT_AVAILABLE_SEARCH,
            PERMISSION_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInBoolean(
            'isActive',
            PERMISSION_DEFAULT_IS_ACTIVE
        )
        isActive: Record<string, any>,
        @PaginationQueryFilterInEnum(
            'group',
            PERMISSION_DEFAULT_GROUP,
            ENUM_PERMISSION_GROUP
        )
        group: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ...isActive,
            ..._search,
            ...group,
        };

        const permissions: PermissionEntity[] =
            await this.permissionService.findAll(find, {
                paging: {
                    limit: _limit,
                    offset: _offset,
                },
                order: _order,
            });

        const total: number = await this.permissionService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: permissions,
        };
    }

    @PermissionGroupDoc()
    @Response('permission.group', {
        serialization: PermissionGroupsSerialization,
    })
    @AuthPermissionProtected(ENUM_AUTH_PERMISSIONS.PERMISSION_READ)
    @AuthJwtAdminAccessProtected()
    @Get('/group')
    async group(
        @PaginationQueryFilterInEnum(
            'groups',
            PERMISSION_DEFAULT_GROUP,
            ENUM_PERMISSION_GROUP
        )
        groups: Record<string, any>
    ): Promise<IResponse> {
        const permissions: PermissionDoc[] =
            await this.permissionService.findAllByGroup(groups);

        const permissionGroups: IPermissionGroup[] =
            await this.permissionService.groupingByGroups(permissions);

        return { data: { groups: permissionGroups } };
    }

    @PermissionGetDoc()
    @Response('permission.get', {
        serialization: PermissionGetSerialization,
    })
    @PermissionGetGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthPermissionProtected(ENUM_AUTH_PERMISSIONS.PERMISSION_READ)
    @AuthJwtAdminAccessProtected()
    @Get('/get/:permission')
    async get(
        @GetPermission(true) permission: PermissionEntity
    ): Promise<IResponse> {
        return { data: permission };
    }

    @PermissionUpdateDoc()
    @Response('permission.update', {
        serialization: ResponseIdSerialization,
    })
    @PermissionUpdateGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthPermissionProtected(
        ENUM_AUTH_PERMISSIONS.PERMISSION_READ,
        ENUM_AUTH_PERMISSIONS.PERMISSION_UPDATE
    )
    @AuthJwtAdminAccessProtected()
    @Put('/update/:permission')
    async update(
        @GetPermission() permission: PermissionDoc,
        @Body() body: PermissionUpdateDescriptionDto
    ): Promise<IResponse> {
        try {
            await this.permissionService.updateDescription(permission, body);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return {
            data: { _id: permission._id },
        };
    }

    @PermissionInactiveDoc()
    @Response('permission.inactive')
    @PermissionUpdateInactiveGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthPermissionProtected(
        ENUM_AUTH_PERMISSIONS.PERMISSION_READ,
        ENUM_AUTH_PERMISSIONS.PERMISSION_UPDATE,
        ENUM_AUTH_PERMISSIONS.PERMISSION_INACTIVE
    )
    @AuthJwtAdminAccessProtected()
    @Patch('/update/:permission/inactive')
    async inactive(@GetPermission() permission: PermissionDoc): Promise<void> {
        try {
            await this.permissionService.inactive(permission);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @PermissionActiveDoc()
    @Response('permission.active', {})
    @PermissionUpdateActiveGuard()
    @RequestParamGuard(PermissionRequestDto)
    @AuthPermissionProtected(
        ENUM_AUTH_PERMISSIONS.PERMISSION_READ,
        ENUM_AUTH_PERMISSIONS.PERMISSION_UPDATE,
        ENUM_AUTH_PERMISSIONS.PERMISSION_ACTIVE
    )
    @AuthJwtAdminAccessProtected()
    @Patch('/update/:permission/active')
    async active(@GetPermission() permission: PermissionDoc): Promise<void> {
        try {
            await this.permissionService.active(permission);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }
}
