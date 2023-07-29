import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseOptions,
    IDatabaseCreateManyOptions,
    IDatabaseManyOptions,
    IDatabaseSoftDeleteManyOptions,
    IDatabaseRestoreManyOptions,
    IDatabaseRawOptions,
    IDatabaseFindOneLockOptions,
} from 'src/common/database/interfaces/database.interface';

export abstract class DatabaseBaseRepositoryAbstract<Entity> {
    abstract findAll<T = Entity>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<T[]>;

    abstract findAllDistinct<T = Entity>(
        fieldDistinct: string,
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<T[]>;

    abstract findOne<T = Entity>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions<any>
    ): Promise<T>;

    abstract findOneById<T = Entity>(
        _id: string,
        options?: IDatabaseFindOneOptions<any>
    ): Promise<T>;

    abstract findOneAndLock<T = Entity>(
        find: Record<string, any>,
        options?: IDatabaseFindOneLockOptions<any>
    ): Promise<T>;

    abstract findOneByIdAndLock<T = Entity>(
        _id: string,
        options?: IDatabaseFindOneLockOptions<any>
    ): Promise<T>;

    abstract getTotal(
        find?: Record<string, any>,
        options?: IDatabaseOptions<any>
    ): Promise<number>;

    abstract exists(
        find: Record<string, any>,
        options?: IDatabaseExistOptions<any>
    ): Promise<boolean>;

    abstract create<Dto>(
        data: Dto,
        options?: IDatabaseCreateOptions<any>
    ): Promise<Entity>;

    abstract save(repository: Entity): Promise<Entity>;

    abstract delete(repository: Entity): Promise<Entity>;

    abstract softDelete(repository: Entity): Promise<Entity>;

    abstract restore(repository: Entity): Promise<Entity>;

    abstract createMany<Dto>(
        data: Dto[],
        options?: IDatabaseCreateManyOptions<any>
    ): Promise<boolean>;

    abstract deleteManyByIds(
        _id: string[],
        options?: IDatabaseManyOptions<any>
    ): Promise<boolean>;

    abstract deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions<any>
    ): Promise<boolean>;

    abstract softDeleteManyByIds(
        _id: string[],
        options?: IDatabaseSoftDeleteManyOptions<any>
    ): Promise<boolean>;

    abstract softDeleteMany(
        find: Record<string, any>,
        options?: IDatabaseSoftDeleteManyOptions<any>
    ): Promise<boolean>;

    abstract restoreManyByIds(
        _id: string[],
        options?: IDatabaseRestoreManyOptions<any>
    ): Promise<boolean>;

    abstract restoreMany(
        find: Record<string, any>,
        options?: IDatabaseRestoreManyOptions<any>
    ): Promise<boolean>;

    abstract updateMany<Dto>(
        find: Record<string, any>,
        data: Dto,
        options?: IDatabaseManyOptions<any>
    ): Promise<boolean>;

    abstract raw<RawResponse, RawQuery = any>(
        rawOperation: RawQuery,
        options?: IDatabaseRawOptions
    ): Promise<RawResponse[]>;

    abstract model(): Promise<any>;
}
