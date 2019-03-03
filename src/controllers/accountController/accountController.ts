import { Request, Response, NextFunction } from 'express';
import { getPersonalInformation } from './getPersonalInformation';

/**
 * Account Controller
 */
export class AccountController {


    /**
     * Get current user information
     * @param req
     * @param res
     * @param next
     */
    public static getPersonalInformation(req: Request, res: Response, next: NextFunction) {
        getPersonalInformation(req, res, next);
    }

}
