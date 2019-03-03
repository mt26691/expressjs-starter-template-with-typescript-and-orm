import { Exception } from './Exception';
import * as HttpStatus from 'http-status-codes';

export class InternalServerError extends Exception {
    constructor(message: string, data?: any) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, data);
    }
}
