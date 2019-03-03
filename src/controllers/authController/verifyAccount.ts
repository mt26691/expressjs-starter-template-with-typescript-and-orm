import { NextFunction } from 'express';
import { Database } from '../../database/database';
import { BadRequest } from '../../components/exceptions';

export async function verifyAccount(req: any, res: any, next: NextFunction) {
    req.checkParams({
        verifyToken: {
            notEmpty: true,
            errorMessage: 'token is required'
        },
    });

    const validateResults = await req.getValidationResult();

    if (validateResults.array().length > 0) {
        return next(new BadRequest(validateResults.array()[0].msg));
    }

    const { verifyToken } = req.params;

    const existingUser = await Database.userRepository.verifyAccount(verifyToken);

    if (!existingUser) {
        return next(new BadRequest('Wrong verify token'));
    }

    // TODO you can redirect user to the frontend url
    res.success({ message: 'Account is verified', user: { email: existingUser.email } });

}
