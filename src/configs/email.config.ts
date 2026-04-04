import { registerAs } from '@nestjs/config';

export interface IConfigEmail {
    noreply: string;
    support: string;
    admin: string;
    batchSize: number;
}

export default registerAs(
    'email',
    (): IConfigEmail => ({
        noreply: 'contact@fedidayeg.fr',
        support: 'contact@fedidayeg.fr',
        admin: 'contact@fedidayeg.fr',
        batchSize: 100,
    })
);