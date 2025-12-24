import { HttpStatus, ValidationError } from '@nestjs/common';
import { EnumRequestStatusCodeError } from '@common/request/enums/request.status-code.enum';

/**
 * Custom exception class for request validation errors.
 * Thrown when request data fails validation rules.
 */
export class RequestValidationException extends Error {
    readonly httpStatus: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
    readonly statusCode: number = EnumRequestStatusCodeError.validation;
    readonly errors: ValidationError[];

    constructor(errors: ValidationError[]) {
        super('request.error.validation');

        this.errors = errors;
    }
}
