import { registerAs } from '@nestjs/config';

export interface IConfigHome {
    name: string;
    url: string;
}

export default registerAs(
    'home',
    (): IConfigHome => ({
        name: process.env.HOME_NAME ?? 'Complete nestjs boilerplate',
        url: process.env.HOME_URL ?? 'https://example.com',
    })
);