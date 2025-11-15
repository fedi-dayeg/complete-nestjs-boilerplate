import { Module } from '@nestjs/common';
import { ApiKeyXApiKeyStrategy } from '@modules/api-key/guards/x-api-key/api-key.x-api-key.strategy';
import { ApiKeyRepositoryModule } from '@modules/api-key/repository/api-key.repository.module';
import { ApiKeyService } from '@modules/api-key/services/api-key.service';

@Module({
    providers: [ApiKeyService, ApiKeyXApiKeyStrategy],
    exports: [ApiKeyService],
    controllers: [],
    imports: [ApiKeyRepositoryModule],
})
export class ApiKeyModule {}
