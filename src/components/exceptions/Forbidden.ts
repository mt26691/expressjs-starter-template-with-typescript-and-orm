import { Exception } from './Exception';
import * as HttpStatus from 'http-status-codes';

export class Forbidden extends Exception {
    constructor(message: string, data?: any) {
        super(message, HttpStatus.FORBIDDEN, data);
    }
}
