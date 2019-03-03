import { Request, Response, NextFunction } from 'express';
import { login } from './login';
import { register } from './register';
import { verifyAccount } from './verifyAccount';

export class AuthController {

    /**
    * Register user with email and password
    * @param req Request
    * @param res Response
    * @param next Next
    */
    public static async register(req: Request, res: Response, next: NextFunction) {
        await register(req, res, next);
    }

    /**
       * Login with email and password
       * @param req Request
       * @param res Response
       * @param next Next
       */
    public static async login(req: Request, res: Response, next: NextFunction) {
        await login(req, res, next);
    }

    /**
     * Verify the account
     * @param req Request
     * @param res Response
     * @param next Next
     */
    public static async verifyAccount(req: Request, res: Response, next: NextFunction) {
        await verifyAccount(req, res, next);
    }

}
