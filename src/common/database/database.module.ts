import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseService } from '@common/database/services/database.service';
import { DatabaseUtil } from '@common/database/utils/database.util';

/**
 * Global database module that provides database services throughout the application.
 */
@Global()
@Module({})
export class DatabaseModule {
    static forRoot(): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [DatabaseService, DatabaseUtil],
            exports: [DatabaseService, DatabaseUtil],
            imports: [],
            controllers: [],
        };
    }
}
