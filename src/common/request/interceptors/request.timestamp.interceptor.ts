import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/common/request/constants/request.status-code.constant';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

@Injectable()
export class RequestTimestampInterceptor
    implements NestInterceptor<Promise<any>>
{
    private readonly maxRequestTimestampInMs: number;

    constructor(
        private readonly configService: ConfigService,
        private readonly helperDateService: HelperDateService
    ) {
        this.maxRequestTimestampInMs = this.configService.get<number>(
            'request.timestamp.toleranceTimeInMs'
        );
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        if (context.getType() === 'http') {
            const request: IRequestApp = context.switchToHttp().getRequest();
            const timestamp: number = request.__timestamp;

            if (!timestamp) {
                throw new ForbiddenException({
                    statusCode:
                        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_TIMESTAMP_INVALID_ERROR,
                    message: 'auth.apiKey.error.timestampInvalid',
                });
            }

            const checkTimestamp =
                this.helperDateService.checkTimestamp(timestamp);

            if (!timestamp || !checkTimestamp) {
                throw new ForbiddenException({
                    statusCode:
                        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_TIMESTAMP_INVALID_ERROR,
                    message: 'request.error.timestampInvalid',
                });
            }

            const timestampDate = this.helperDateService.create(timestamp);

            const toleranceMin = this.helperDateService.backwardInMilliseconds(
                this.maxRequestTimestampInMs
            );
            const toleranceMax = this.helperDateService.forwardInMilliseconds(
                this.maxRequestTimestampInMs
            );

            if (timestampDate < toleranceMin || timestampDate > toleranceMax) {
                throw new ForbiddenException({
                    statusCode:
                        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_TIMESTAMP_INVALID_ERROR,
                    message: 'request.error.timestampInvalid',
                });
            }
        }

        return next.handle();
    }
}
