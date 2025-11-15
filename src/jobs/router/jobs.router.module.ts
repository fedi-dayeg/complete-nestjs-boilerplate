import { Module } from '@nestjs/common';
import { ApiKeyModule } from '@modules/api-key/api-key.module';
import { ApiKeyInactiveTask } from '@modules/api-key/tasks/api-key.inactive.task';

@Module({
    providers: [ApiKeyInactiveTask],
    exports: [],
    imports: [ApiKeyModule],
    controllers: [],
})
export class JobsRouterModule {}
