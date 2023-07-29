import { faker } from '@faker-js/faker';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ENUM_AUTH_ACCESS_FOR } from 'src/common/auth/constants/auth.enum.constant';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { UserGetSerialization } from 'src/modules/user/serializations/user.get.serialization';

export class UserPayloadSerialization extends OmitType(UserGetSerialization, [
    'photo',
    'role',
    'isActive',
    'blocked',
    'email',
    'mobileNumber',
    'passwordExpired',
    'passwordCreated',
    'passwordAttempt',
    'signUpDate',
    'inactiveDate',
    'blockedDate',
    'createdAt',
    'updatedAt',
] as const) {
    @Exclude()
    readonly photo?: AwsS3Serialization;

    @ApiProperty({
        example: faker.datatype.uuid(),
        type: 'string',
    })
    @Transform(({ obj }) => `${obj.role._id}`)
    readonly role: string;

    @ApiProperty({
        example: ENUM_AUTH_ACCESS_FOR.ADMIN,
        type: 'string',
        enum: ENUM_AUTH_ACCESS_FOR,
    })
    @Expose()
    @Transform(({ obj }) => obj.role.accessFor)
    readonly accessFor: ENUM_AUTH_ACCESS_FOR;

    @Exclude()
    readonly isActive: boolean;

    @Exclude()
    readonly blocked: boolean;

    @Exclude()
    readonly passwordExpired: Date;

    @Exclude()
    readonly passwordCreated: Date;

    @Exclude()
    readonly passwordAttempt: number;

    @Exclude()
    readonly signUpDate: Date;

    @Exclude()
    readonly inactiveDate?: Date;

    @Exclude()
    readonly blockedDate?: Date;

    @Exclude()
    readonly email: Date;

    @Exclude()
    readonly mobileNumber?: number;

    readonly rememberMe: boolean;
    readonly loginDate: Date;

    @Exclude()
    readonly createdAt: number;

    @Exclude()
    readonly updatedAt: number;
}
