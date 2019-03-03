import { BaseRepository } from './BaseRepository';
import { User } from '../entity';
import * as uuid from 'uuid';
import * as crypto from 'crypto';

export class UserRepository extends BaseRepository<User> {

    constructor(database) {
        super(database, User);
    }

    /**
     * Register new user with email and password
     * @param email Email
     * @param password Password
     */
    async register(email: string, password: string): Promise<any> {
        // create salt
        const salt = uuid.v4();
        const passwordHash = crypto
            .createHmac('sha1', salt)
            .update(password)
            .digest('hex');
        const user = { email, passwordHash, salt, isVerified: false, verifyToken: uuid.v4() };
        await this.instance.insert(user);
        return user;
    }

    async login(email: string, password: string) {
        const user = await this.findUserByEmail(email);

        if (user) {
            const passwordHash = crypto
                .createHmac('sha1', user.salt)
                .update(password)
                .digest('hex');
            if (passwordHash === user.passwordHash) {
                return { isRightPassword: true, user: user };
            }
        }

        return { isRightPassword: false, user: null };
    }

    async findUserByEmail(email: string) {
        const user = await this.instance
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();
        return user;
    }

    async findUserById(id: number) {
        const user = await this.instance.findOne(id);
        return user;
    }

    /**
     * Verify the user by the token in the email
     * @param verifyToken Verify token
     */
    async verifyAccount(verifyToken: string) {
        // find user by verify token
        const user = await this.instance
            .createQueryBuilder('user')
            .where('user.verifyToken = :verifyToken', { verifyToken })
            .getOne();
        if (user && !user.isVerified) {
            user.isVerified = true;
            await this.instance.save(user);
            return user;
        }

    }
}
