import { Exception } from './Exception';
import * as HttpStatus from 'http-status-codes';

export class UnprocessableEntity extends Exception {
    public reason?: any;

    constructor(message: string, reason: any, data?: any) {
        super(message, HttpStatus.UNPROCESSABLE_ENTITY, data);

        if (reason) { this.reason = reason; }
    }
}
