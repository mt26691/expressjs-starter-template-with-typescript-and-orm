import * as HttpStatus from 'http-status-codes';
import { NextFunction } from 'express';

/**
 * The response middleware is act like a wrapper around your response in controller.
 * In controller, you just need to call res.success(data).
 * The returned data will be wrapped inside the data tag.
 * Check login.ts for example
 * @param _req Request
 * @param res Response
 * @param next Next function
 */
export function responseMiddleware(_req: any, res: any, next: NextFunction) {
    res.success = (data: any, extra: any = null) => {
        res.isHandled = true;
        res.status(HttpStatus.OK).json({
            success: true,
            data: data,
            extra: extra
        });
    };
    res.error = (error: any) => {
        res.isHandled = true;
        res.status(error.status || HttpStatus.BAD_REQUEST).json({
            success: false,
            error: error
        });
    };
    next();
}
