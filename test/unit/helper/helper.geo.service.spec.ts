import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { HelperModule } from 'src/common/helper/helper.module';
import { HelperGeoService } from 'src/common/helper/services/helper.geo.service';
import configs from 'src/configs';

describe('HelperGeoService', () => {
    let helperGeoService: HelperGeoService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: configs,
                    isGlobal: true,
                    cache: true,
                    envFilePath: ['.env'],
                    expandVariables: true,
                }),
                HelperModule,
            ],
        }).compile();

        helperGeoService = moduleRef.get<HelperGeoService>(HelperGeoService);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(HelperGeoService).toBeDefined();
    });

    describe('inRadius', () => {
        it('should be success', async () => {
            const result: boolean = helperGeoService.inRadius(
                {
                    longitude: 6.1754,
                    latitude: 106.8272,
                    radiusInMeters: 10,
                },
                { longitude: 6.1754, latitude: 106.8272 }
            );

            jest.spyOn(helperGeoService, 'inRadius').mockReturnValueOnce(
                result
            );

            expect(result).toBeTruthy();
            expect(result).toBe(true);
        });
    });
});
