import * as express from 'express';
import * as path from 'path';
import * as expressValidator from 'express-validator';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { loadRoute } from './components/utils/loadRoute';
import { QueueContainer } from './components/queue/QueueContainer';
import { Database } from './database/database';
import { config } from './config';
import * as expressJwt from 'express-jwt';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { responseMiddleware } from './middlewares/responseMiddleware';

(async function () {
    QueueContainer.register();
    await Database.init(config.db);

    const app = express();

    // cors settings
    app.use(cors());

    // body parser, controllers can be able to receive posted data from client
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use('/ping', function (_req, res) {
        res.send('pong');
    });

    // jwt middleware, we will use it for authentication.
    app.use(expressJwt({ secret: config.env.secret }).unless({
        path: [
            // the routes that can be access by any user
            '/api/auth/login',
            '/api/auth/register',
            // since the unless method does not accept the parameter in url
            // so we use the regext pattern for /api/auth/verify/:verifyToken route
            /^\/api\/auth\/verify\/.*/
        ],
    }));

    app.use(responseMiddleware);

    // Routing
    const router = express.Router();
    // File in the /components/routing folder will be loaded automatically
    // the route name will be /api/{file-name}
    loadRoute(router, path.resolve(__dirname, './components/routing'));
    app.use(expressValidator());
    app.use('/api', router);

    // not found route
    app.get('*', (_req, res) => {
        res.status(404).send({
            message: 'Route not found'
        });
    });

    app.use(errorMiddleware);
    const port = process.env.PORT || 3000;
    // process the queue
    QueueContainer.process();
    app.listen(port, () => {
        console.log(`Server started running on *:${port}`);
    });
}());

