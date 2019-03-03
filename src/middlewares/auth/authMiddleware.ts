import { Forbidden } from '../../components/exceptions';
import { NextFunction } from 'express';
import { Database } from '../../database/database';

/**
 * If user creates the request to the route that protected by JWT middleware, he should put the access token in the
 * Authorization header with value = Bearer {{token-value}}. The JWT middleware will verify the token is valid or not
 * If token is not valid, JWT will return Bad Request to user.
 * If token is valid, JWT will attach user information that you put in the token, see login.ts for example.
 * You can use the auth middleware on the route you need to check if current user has enough privileges to access that route.
 * Like if user is verify or not, user is banned or not...
 * @param req Request
 * @param res Response
 * @param next Next
 */
export async function authMiddleware(req: any, _res: any, next: NextFunction) {
    if (!req.user) {
        return next(new Forbidden('Access denied.'));
    }
    console.log(`Information that is decrypted from access token`);
    console.log(req.user);

    // get user from database to verify user again
    const currentUser = await Database.userRepository.findUserById(req.user.id);
    if (!currentUser) {
        return next(new Forbidden('User not found'));
    }
    if (!currentUser.isVerified) {
        return next(new Forbidden('User is not verified'));
    }
    // allow user go to next step
    next();
}
