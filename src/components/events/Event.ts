import { EventTypes } from './';
import { IEvent } from './';

/**
 * Base Event class
 **/
export abstract class Event implements IEvent {
    childClass: string;
    data: any;
    queue: EventTypes;

    constructor(data) {
        // get child's name and log event data in database
        this.data = data;
        this.queue = EventTypes.email;
        this.childClass = (this.constructor as any).name;
    }

    public async execute(): Promise<any> {
        throw new Error('Method must be implemented in derivered class.');
    }
}
