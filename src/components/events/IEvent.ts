import { EventTypes } from './';

/**
 * Event will load notification
 */
export interface IEvent {
    queue: EventTypes;
    data: any;

    execute();
}
