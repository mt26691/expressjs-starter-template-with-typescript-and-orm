import { Exception } from './Exception';
import * as HttpStatus from 'http-status-codes';

export class NotFound extends Exception {
    constructor(message: string, data?: any) {
        super(message, HttpStatus.NOT_FOUND, data);
    }
}
