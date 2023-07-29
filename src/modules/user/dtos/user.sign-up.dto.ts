import { OmitType } from '@nestjs/swagger';
import { UserCreateDto } from './user.create.dto';

export class UserSignUpDto extends OmitType(UserCreateDto, ['role'] as const) {}
