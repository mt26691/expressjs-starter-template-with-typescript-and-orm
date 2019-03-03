export class Exception implements Error {
    public message: string;
    public name: string;
    public status: number;
    public data?: any;

    constructor(message: string, status: number, data: any) {
        this.message = message;
        this.name = (this.constructor as any).name;
        this.status = status;
        if (data) { this.data = data; }
        Error.captureStackTrace(this, this.constructor);
    }
}
