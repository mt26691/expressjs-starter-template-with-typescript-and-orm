import * as Queue from 'bull';
import { EventTypes } from '../events';

export interface IJob {
    job: Queue.Job;

    queueName: EventTypes;

    jobOption: Queue.JobOptions;

    setQueueName(queueName: EventTypes);

    dispatch(jobOptions?: Queue.JobOptions);

    stop();

    dequeue(queueName: EventTypes);

    flush(queueName: EventTypes);

    setPriority(data: number);

    setDelay(data: number);

    setAttemps(data: number);

    setBackOff(data: number);

    setTimeOut(timeOut: number);

    setRemoveOnComplete(data: boolean);

    setRemoveOnFail(data: boolean);
}
