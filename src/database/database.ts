import { UserRepository } from './repositories/UserRepository';
import * as DBEntities from './entity';
import { createConnection } from 'typeorm';

export class Database {

    public static userRepository: UserRepository;

    public static async init(configs: any) {
        const connection = await this.initConnection(configs);
        this.userRepository = new UserRepository(connection);
        return this;
    }

    private static async initConnection(db) {
        const entities: any[] = [];

        // tslint:disable-next-line:forin
        for (const i in DBEntities) {
            entities.push(DBEntities[i]);
        }

        const dbConnection = await createConnection(
            {
                type: db.dbType,
                host: db.host,
                port: db.port,
                username: db.username,
                password: db.password,
                database: db.database,
                entities: entities,
                synchronize: true,
                maxQueryExecutionTime: 2000,
                logging: ['error', 'warn'],
                logger: 'file'
            }
        ).catch((err: any) => {
            throw err;
        });
        return dbConnection;
    }

}
