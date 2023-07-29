import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerOptions } from 'winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { DEBUGGER_NAME } from 'src/common/debugger/constants/debugger.constant';
import { IDebuggerOptionService } from 'src/common/debugger/interfaces/debugger.options-service.interface';

@Injectable()
export class DebuggerOptionService implements IDebuggerOptionService {
    private readonly writeIntoFile: boolean;
    private readonly writeIntoConsole: boolean;
    private readonly maxSize: string;
    private readonly maxFiles: string;

    constructor(private configService: ConfigService) {
        this.writeIntoFile = this.configService.get<boolean>(
            'debugger.system.writeIntoFile'
        );
        this.writeIntoConsole = this.configService.get<boolean>(
            'debugger.system.writeIntoConsole'
        );
        this.maxSize = this.configService.get<string>(
            'debugger.system.maxSize'
        );
        this.maxFiles = this.configService.get<string>(
            'debugger.system.maxFiles'
        );
    }

    createLogger(): LoggerOptions {
        const transports = [];

        if (this.writeIntoFile) {
            transports.push(
                new DailyRotateFile({
                    filename: `%DATE%.log`,
                    dirname: `logs/${DEBUGGER_NAME}/error`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: this.maxSize,
                    maxFiles: this.maxFiles,
                    level: 'error',
                })
            );
            transports.push(
                new DailyRotateFile({
                    filename: `%DATE%.log`,
                    dirname: `logs/${DEBUGGER_NAME}/default`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: this.maxSize,
                    maxFiles: this.maxFiles,
                    level: 'info',
                })
            );
            transports.push(
                new DailyRotateFile({
                    filename: `%DATE%.log`,
                    dirname: `logs/${DEBUGGER_NAME}/debug`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: this.maxSize,
                    maxFiles: this.maxFiles,
                    level: 'debug',
                })
            );
        }

        if (this.writeIntoConsole) {
            transports.push(new winston.transports.Console());
        }

        const loggerOptions: LoggerOptions = {
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint()
            ),
            transports,
        };

        return loggerOptions;
    }
}
