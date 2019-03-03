import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { IMail } from './IMail';
import { EmailEventModel } from '../../models/event';
import { config } from '../../config';

export class Mail implements IMail {
    private static transporter: any;

    constructor() {
        Mail.transporter = Mail.createTransporter(config.email);
    }

    private static createTransporter(emailConfig) {
        return nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: true,
            auth: {
                user: emailConfig.auth.user,
                pass: emailConfig.auth.pass,
            },
        });
    }

    public async send(data: EmailEventModel) {
        const mailOps = data as nodemailer.SendMailOptions;
        mailOps.from = config.email.auth.user;
        mailOps['context']['basePath'] = config.env.basePath;

        Mail.transporter.use(
            'compile',
            hbs({
                viewPath: 'src/components/mail/views',
                extName: '.hbs',
            }),
        );

        await Mail.transporter.sendMail(mailOps, (error, info) => {
            return {
                info: info,
                error: error,
            };
        });
    }
}
