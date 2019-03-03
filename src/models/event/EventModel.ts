import { EventTypes } from '../../components/events';
import { EmailEventModel } from './';

export class EventModel {
    queue: EventTypes;
    data: EmailEventModel | null | undefined;
}
