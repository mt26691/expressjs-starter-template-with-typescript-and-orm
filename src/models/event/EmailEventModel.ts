export interface EmailEventModel {
    to: string;
    from?: string;
    subject: string;
    cc?: string | string[];
    bcc?: string | string[];
    template: string;
    context?: any;
}
