import { Module } from '@nestjs/common';
import { AwsS3Service } from './services/aws.s3.service';

@Module({
    exports: [AwsS3Service],
    providers: [AwsS3Service],
    imports: [],
    controllers: [],
})
export class AwsModule {}
