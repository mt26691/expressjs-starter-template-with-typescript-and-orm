import { Request } from 'express';
import { Database } from '../../database/database';
import { BadRequest } from '../../components/exceptions';
import { EventTypes } from '../../components/events';
import { Job } from '../../components/job/Job';
import { config } from '../../config';

/**
   * Register new user with username and password
   * @param req Request
   * @param res Response
   */
export async function register(req: Request, res: any, next: any) {
    req.checkBody({
        email: {
            notEmpty: true,
            errorMessage: 'Email is required',
            isEmail: {
                errorMessage: 'Email is not valid',
            },
            isLength: {
                errorMessage: 'Email should be from 4 to 255 chars',
                options: { min: 4, max: 255 }
            }
        },
        password: {
            notEmpty: true,
            errorMessage: 'Password is required',
            isLength: {
                errorMessage: 'Password should have at least 6 characters',
                options: { min: 6 }
            }
        },
    });

    const validateResults = await req.getValidationResult().catch(next);

    if (validateResults.array().length > 0) {
        return next(new BadRequest(validateResults.array()[0].msg));
    }

    const { email, password } = req.body;

    const duplicatedUser = await Database.userRepository.findUserByEmail(email);
    if (duplicatedUser) {
        return next(new BadRequest('Duplicated email'));
    }

    const newUser = await Database.userRepository.register(email, password);

    const job = new Job({
        queue: EventTypes.email,
        data: {
            to: email,
            subject: 'Welcome to Express template for web api',
            template: 'register',
            context: {
                token: newUser.verifyToken,
                email: email,
                verifyAccountUrl: config.auth.verifyAccountUrl
            },
        },
    });

    // create the email job and dispatch it to email queue
    // the job will be taken from the queue and handle by event factory
    // since the queue name = EventTypes.email, so the factory will call the EmailNotification
    // class to handle the event. Check EventFactory.ts and EmailNotification.ts
    job.dispatch().then(_result => {

    });

    res.success({ msg: 'User is created, please check email for activating account' });
}
