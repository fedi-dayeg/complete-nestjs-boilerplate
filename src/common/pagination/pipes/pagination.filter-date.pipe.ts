import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import {
    ArgumentMetadata,
    PipeTransform,
    Scope,
} from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS } from 'src/common/pagination/constants/pagination.enum.constant';
import { IPaginationFilterDateOptions } from 'src/common/pagination/interfaces/pagination.interface';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

export function PaginationFilterDatePipe(
    options?: IPaginationFilterDateOptions
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterDatePipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService,
            private readonly helperDateService: HelperDateService
        ) {}

        async transform(
            value: string,
            { data: field }: ArgumentMetadata
        ): Promise<Record<string, Date>> {
            let date: Date = this.helperDateService.create(value);

            if (
                options?.time ===
                ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS.END_OF_DAY
            ) {
                date = this.helperDateService.endOfDay(date);
            } else if (
                options?.time ===
                ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS.START_OF_DAY
            ) {
                date = this.helperDateService.startOfDay(date);
            }

            this.request.__filters = {
                ...this.request.__filters,
                [field]: value,
            };

            return this.paginationService.filterDate(field, date);
        }
    }

    return mixin(MixinPaginationFilterDatePipe);
}
