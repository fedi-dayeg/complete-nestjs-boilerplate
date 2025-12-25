import { Injectable, NestMiddleware } from '@nestjs/common';
import { IRequestApp } from '@common/request/interfaces/request.interface';
import { NextFunction } from 'express';
import compression from 'compression';

/**
 * HTTP response compression middleware for improved performance and bandwidth optimization.
 * Applies gzip/deflate compression to responses based on client capabilities.
 */
@Injectable()
export class RequestCompressionMiddleware implements NestMiddleware {
    constructor() {}

    /**
     * Applies compression middleware to HTTP responses.
     *
     * @param _req - The Express request object
     * @param _res - The Express response object
     * @param next - The next middleware function
     */
    async use(
        _req: IRequestApp,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        compression();
        next();
    }
}
