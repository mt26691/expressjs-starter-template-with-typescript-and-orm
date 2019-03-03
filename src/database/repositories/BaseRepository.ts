import { Repository } from 'typeorm';
export class BaseRepository<T> {
    instance: Repository<T>;
    entity: any;

    constructor(connection: any, c: Function) {
        this.instance = connection.getRepository(c);
        this.entity = c;
    }

    getInstance(): Repository<T> {
        return this.instance;
    }

    getEntity() {
        return this.entity;
    }

    async save(entity: any) {
        return this.instance.save(entity);
    }

}

