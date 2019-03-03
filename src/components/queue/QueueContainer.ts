import * as Queue from 'bull';
import { EventTypes } from '../events';
import { EventFactory } from '../factories/EventFactory';

interface IQueueList {
    [key: string]: Queue.Queue;
}

export class QueueContainer {
    static listQueue: IQueueList = {};

    public static register() {
        // tslint:disable-next-line:forin
        for (const key in EventTypes) {
            // TODO: handle redis connection reuse
            this.listQueue[EventTypes[key]] = new Queue(EventTypes[key], {
                prefix: '{' + EventTypes[key] + '}',
            });

            this.listQueue[EventTypes[key]].on('error', function (err) {
                console.log(`[Queue: ${EventTypes[key]}],  Unknown Error occured:`, err);
            });

            this.listQueue[EventTypes[key]].on('failed', function (job, err) {
                console.log(`[Queue: ${EventTypes[key]}],  Job failed! ID: ${job.id}`, err);
            });

            this.listQueue[EventTypes[key]].on('completed', function (job, result) {
                console.log(`[Queue: ${EventTypes[key]}],  Completed job with ID: ${job.id}`);
                console.log(`${result}`);
            });
        }
    }

    public static process() {
        // tslint:disable-next-line:forin
        for (const name in this.listQueue) {
            this.listQueue[name].process(job => {
                const event = EventFactory.getEvent(job.data);
                return event.execute();
            });
        }
    }

    public static getQueue(queueName): Queue.Queue {
        return this.listQueue[queueName];
    }

    public static add(queueName: EventTypes, data: any, option?: Queue.JobOptions) {
        return this.listQueue[queueName].add(data, option);
    }

    public static async count(queueName: EventTypes): Promise<number> {
        return await this.listQueue[queueName].count();
    }

    public static async getJobCount(queueName: EventTypes): Promise<Queue.JobCounts> {
        return await this.listQueue[queueName].getJobCounts();
    }

    public static async cleanActiveJob(queueName: EventTypes) {
        return await this.listQueue[queueName].clean(100000, 'active');
    }

    public static async cleanCompletedJob(queueName: EventTypes) {
        return await this.listQueue[queueName].clean(100000, 'completed');
    }

    public static async cleanDelayedJob(queueName: EventTypes) {
        return await this.listQueue[queueName].clean(100000, 'delayed');
    }

    public static async cleanFailedJob(queueName: EventTypes) {
        return await this.listQueue[queueName].clean(100000, 'failed');
    }

    public static async cleanWaitingJob(queueName: EventTypes) {
        return await this.listQueue[queueName].clean(100000, 'wait');
    }

    public static async removeRepeatable(queueName: EventTypes, repeat: any) {
        return await this.listQueue[queueName].removeRepeatable(queueName, repeat);
    }
}
