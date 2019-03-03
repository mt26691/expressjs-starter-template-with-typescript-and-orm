import { EventTypes } from '../events';
import { EmailNotification } from '../events/notifications/EmailNotification';

/**
 * Event factory class
 * It is used for create factory that handle the event data
 */
export class EventFactory {
    public static getEvent(event: any) {
        switch (event.queue) {
            case EventTypes.email:
                return new EmailNotification(event.data);
            default:
                throw new Error('Command type not supported!');
        }
    }
}
