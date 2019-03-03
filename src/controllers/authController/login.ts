import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Database } from '../../database/database';
import { BadRequest } from '../../components/exceptions';
import { config } from '../../config';

/**
   * Login with Email and password
   * @param req Request
   * @param res Response
   */
export async function login(req: Request, res: any, next: any) {
    req.checkBody({
        email: {
            notEmpty: true,
            errorMessage: 'Email is required',
        },
        password: {
            notEmpty: true,
            errorMessage: 'Password is required',
        },
    });

    const validateResults = await req.getValidationResult().catch(next);

    if (validateResults.array().length > 0) {
        return next(new BadRequest(validateResults.array()[0].msg));
    }

    const { email, password } = req.body;

    const loggedIn = await Database.userRepository.login(email, password).catch(next);

    if (!loggedIn.user) {
        return next(new BadRequest('Wrong email or password'));
    }
    if (loggedIn.user && !loggedIn.user.isVerified) {
        return next(new BadRequest('Account is not verified.'));
    }

    const token = jwt.sign(
        {
            id: loggedIn.user.id,
            email: loggedIn.user.email
        },
        config.env.secret as string,
        { expiresIn: 60 * 2880 }, // expire in 2 days
    );

    res.success({
        user: {
            id: loggedIn.user.id,
            email: loggedIn.user.email,
        },
        accessToken: token
    });
}
