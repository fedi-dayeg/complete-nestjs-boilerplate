import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces';
import { isMongoId } from 'class-validator';
import { EnumRequestStatusCodeError } from '@common/request/enums/request.status-code.enum';

/**
 * NestJS Pipe that validates MongoDB ObjectId format for route parameters.
 * Used to validate ID parameters in API endpoints before they reach controllers.
 * Ensures only valid MongoDB ObjectId strings are accepted.
 */
@Injectable()
export class RequestIsValidObjectIdPipe implements PipeTransform {
    /**
     * Validates that the input value is a valid MongoDB ObjectId.
     * Throws BadRequestException if validation fails.
     *
     * @param {string} value - The input value to validate as MongoDB ObjectId
     * @param {ArgumentMetadata} metadata - NestJS argument metadata with parameter name and type
     * @returns {string} The validated MongoDB ObjectId string if valid
     * @throws {BadRequestException} If value is empty, not a string, or invalid MongoDB ObjectId format
     */
    async transform(
        value: string,
        metadata: ArgumentMetadata
    ): Promise<string> {
        if (!value || typeof value !== 'string' || isMongoId(value)) {
            throw new BadRequestException({
                statusCode: EnumRequestStatusCodeError.validation,
                message: 'request.error.isMongoId',
                messageProperties: {
                    property: metadata.data,
                },
            });
        }

        return value;
    }
}
