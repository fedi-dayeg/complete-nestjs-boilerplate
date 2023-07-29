import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ApiKeyEntity } from 'src/common/api-key/repository/entities/api-key.entity';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
    LoggerDoc,
    LoggerEntity,
} from 'src/common/logger/repository/entities/logger.entity';

@Injectable()
export class LoggerRepository extends DatabaseMongoUUIDRepositoryAbstract<
    LoggerEntity,
    LoggerDoc
> {
    constructor(
        @DatabaseModel(LoggerEntity.name)
        private readonly LoggerDoc: Model<LoggerEntity>
    ) {
        super(LoggerDoc, {
            path: 'apiKey',
            match: '_id',
            model: ApiKeyEntity.name,
        });
    }
}
