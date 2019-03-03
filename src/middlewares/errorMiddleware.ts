import { NextFunction, Response, Request } from 'express';
import * as HttpStatus from 'http-status-codes';

/**
 * Error middleware is used for handling the error that is thrown during execution.
 * It will catch the error, and wrap it in response data as success = false and error = current error
 * @param err Error
 * @param _req Request
 * @param res Response
 * @param next Next function
 */
export function errorMiddleware(err: any, _req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || HttpStatus.BAD_REQUEST).json({
        success: false,
        error: err
    });
}
