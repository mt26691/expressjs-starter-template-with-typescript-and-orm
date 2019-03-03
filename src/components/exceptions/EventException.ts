import { Exception } from './Exception';
import * as HttpStatus from 'http-status-codes';

export class EventException extends Exception {
    constructor(message: string, data?: any) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, data);
    }
}
