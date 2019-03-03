import 'dotenv/config';

export const config = {
    env: {
        log: process.env.APP_LOG ? process.env.APP_LOG : 'debug',
        port: process.env.APP_PORT ? process.env.APP_PORT : 3000,
        secret: process.env.APP_JWT_SECRET || '',
        queueDriver: process.env.QUEUE_DRIVER,
        basePath: process.env.APP_URL,
    },
    redis: {
        port: process.env.REDIS_PORT || 'localhost',
        host: process.env.REDIS_HOST || 6379
    },
    db: {
        dbType: process.env.DB_TYPE || 'postgres', // postgre, mysql you go to typeorm.io for more detail,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
        port: process.env.DB_PORT ? process.env.DB_PORT : 5432,
        max: process.env.DB_CONNECTION_POOL ? process.env.DB_CONNECTION_POOL : 10, // max number of clients in the pool
        idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT ? process.env.DB_IDLE_TIMEOUT : 30000, // how long a client is allowed to remain idle before being closed
    },
    email: {
        host: process.env.MAIL_HOST ? process.env.MAIL_HOST : 'localhost',
        port: process.env.MAIL_PORT ? process.env.MAIL_PORT : 25,
        secure: process.env.MAIL_SSL ? process.env.MAIL_SSL : false, // secure:true for port 465, secure:false for port 587
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    },
    auth:
    {
        verifyAccountUrl: process.env.VERIFY_ACCOUNT_URL
    }
};
