import { Exception } from './Exception';
import * as HttpStatus from 'http-status-codes';

export class BadRequest extends Exception {
    constructor(message: string, data?: any) {
        super(message, HttpStatus.BAD_REQUEST, data);
    }
}
