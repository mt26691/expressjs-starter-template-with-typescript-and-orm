import * as Queue from 'bull';
import { EventTypes } from '../events';
import { IJob } from './IJob';
import { EventModel } from '../../models/event';
import { QueueContainer } from '../queue/QueueContainer';

export class Job implements IJob {
    job: Queue.Job;
    jobOption: Queue.JobOptions;
    queueName: EventTypes;
    event: EventModel;

    constructor(event: EventModel) {
        this.event = event;
        this.jobOption = {};
    }

    /**
     * Dispatch event to queue
     * @param jobOptions Job options, optional
     */
    async dispatch(jobOptions?: Queue.JobOptions) {
        this.setQueueName(this.event.queue);
        const defaults = {
            attempts: 3,
            timeout: 600000,
            removeOnComplete: true
        };
        this.jobOption = Object.assign(defaults, jobOptions);

        this.job = await QueueContainer.add(this.queueName, this.event, this.jobOption);

        return this.job.finished();
    }

    /**
     * Set queue name for a specific job
     * @param queueName Queue's name
     */
    setQueueName(queueName: EventTypes) {
        this.queueName = queueName;
    }
    /**
    * Optional priority value. ranges from 1 (highest priority) to MAX_INT  (lowest priority).
    * Note that using priorities has a slight impact on performance, so do not use it if not required
    */
    setPriority(data: number) {
        this.jobOption.priority = data;
    }

    /**
    * An amount of miliseconds to wait until this job can be processed.
    * Note that for accurate delays, both server and clients should have their clocks synchronized. [optional]
    */
    setDelay(data: number) {
        this.jobOption.delay = data;
    }

    /**
    * The total number of attempts to try the job until it completes
    */
    setAttemps(data: number) {
        this.jobOption.attempts = data;
    }

    /**
    *  The number of milliseconds after which the job should be fail with a timeout error
     */
    setTimeOut(timeOut: number) {
        this.jobOption.timeout = timeOut;
    }

    setRemoveOnComplete(data: boolean) {
        this.jobOption.removeOnComplete = data;
    }

    setRemoveOnFail(data: boolean) {
        this.jobOption.removeOnFail = data;
    }

    /**
    * Backoff setting for automatic retries if the job fails
    */
    setBackOff(data: number) {
        this.jobOption.backoff = data;
    }

    /**
     * Stop job with id and remove from queue
     * @param jobId JobId
     */
    async stop() {
        if (this.job !== null && this.job !== undefined) {
            this.job.remove();
        }
    }

    /**
     * Remove not running job from queue
     * @param queueName
     */
    async dequeue(queueName: EventTypes) {
        await QueueContainer.cleanWaitingJob(queueName);
    }

    /**
     * Clean all failed job
     * @param queueName queue name
     */
    async flush(queueName: EventTypes) {
        await QueueContainer.cleanFailedJob(queueName);
    }
}
