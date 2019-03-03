import { Exception } from './Exception';
import * as HttpStatus from 'http-status-codes';

export class UnauthorizedError extends Exception {
    constructor(message: string, data?: any) {
        super(message, HttpStatus.UNAUTHORIZED, data);
    }
}
