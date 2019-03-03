import { Event } from '../';
import { Mail } from '../../mail';

/**
 * Email notification class is used for handle the email event
 */
export class EmailNotification extends Event {
    constructor(data) {
        super(data);
    }

    public async execute() {
        console.log('Email sent!');
        const mail = new Mail();
        return mail.send(this.data);
    }
}
