# ExpressJs starter template with Typescript, JWT and ORM

## Prerequisite
  - NodeJs (>=9.0.0)
  - Postgre SQL (>=9.0.0)
  - Redis server (for storing queue information)

## Set up environment
  - Enter login information for PostgreSQL, Redis and SMTP server in .env file

## Start server
Install the dependencies and start the server.

```sh
npm install
npm start
```

## Development
The entry point of the application is the main.ts file, which is an async function. In main.ts, we will initialize the application's services like QueueContainer, Database, JWT, Routing, Response and Error middleware.

## Database
We use the [TypeORM](https://typeorm.io/) for database manipulation, in main.ts file we create connection to the database and the repositories. You can check out.

```sh
 await Database.init(config.db);
```

## Json web token (JWT)
In this application, we use JWT for authenticating the user in the system. We initialize the jwt middleware in the main.ts file.

```sh
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
```
The routes in unless function is anonymous route, which allow any user can access. The rest will be protected by JWT.
If you try to go to the route  http://localhost:3000/api/user/me without providing access token, you will receive the error Access Denied: "No authorization token was found"

### How to get access token?
To get access token token for a user, firstly, you should register an account. By using register route.

```sh
POST http://localhost:3000/api/auth/register
Data
{
	"email":"your_account@gmail.com",
	"password":"123456"
}
```

After that you will receive a verify account email, click on that link to verify the account.
Login by the verified account.
```sh
POST http://localhost:3000/api/auth/login
Data
{
	"email":"your_account@gmail.com",
	"password":"123456"
}
```
Returned data
```sh
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "email": "your_account@gmail.com"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJuZ3V5ZW5tYW5odHVuZzg0OEBnbWFpbC5jb20iLCJpYXQiOjE1NTE1ODA5ODcsImV4cCI6MTU1MTc1Mzc4N30.m1qOxiRpfVvfSUspAIVO53pT8ViI-uCrtcxO--SPd9c"
    },
    "extra": null
}
```

You can wrap the access token in the returned data. By using this token, you can access the protected route like  http://localhost:3000/api/account/me

To access to this route, you should put the access token in Authorization of the request likes this.
```sh
Authorization: Bearer access_token_value
```
Example:
![https://problemlover.com/](https://cldup.com/dTxpPi9lDf.thumb.png)

## Routing
We load the route by the loadRoute function in main.ts file. Every file in the src/components/routing will be loaded into the application.
Route name will be

```sh
/api/{file-name}/{route-in-file}
```
Example:
```sh
/api/auth/login
```
## Express Validator
We use the [express validator ](https://express-validator.github.io/docs/) to validate the request data. It is a very useful library that help you validate the request data.
Initializing express validator in main.ts file:
```sh
app.use(expressValidator());
```
Example:
You can check the login.ts file for example:
```sh
req.checkBody({
    email: {
        notEmpty: true,
        errorMessage: 'Email is required',
    },
    password: {
        notEmpty: true,
        errorMessage: 'Password is required',
    },
});

const validateResults = await req.getValidationResult().catch(next);

if (validateResults.array().length > 0) {
    return next(new BadRequest(validateResults.array()[0].msg));
}
```

## Bull Queue
[Bull ](https://github.com/OptimalBits/bull) is the redis-based queue for node. We use bull to run scheduled jobs, or the tasks that do not need available immediately to user like video encoding, send an email.
In main.ts, we initialize the queue and then process the remain items in the queue.

```sh
QueueContainer.register();
QueueContainer.process();
```
Example:
When user registers an account, we will send an activation email. This email does not need available immediately, user can wait about 5-10 seconds before this email available to them. So we use the email queue in this case. Check register.ts for more detail.

```sh
const job = new Job({
    queue: EventTypes.email,
    data: {
        to: email,
        subject: 'Welcome to Express template for web api',
        template: 'register',
        context: {
            token: newUser.verifyToken,
            email: email,
            verifyAccountUrl: config.auth.verifyAccountUrl
        },
    },
});

job.dispatch().then(_result => {

});
```

The job is dispatched to Bull queue, and then processing. Based on the job detail, we will use the event factory to call the proper executer. Check QueueContainer.ts the process method for more details.

```sh
public static process() {
    // tslint:disable-next-line:forin
    for (const name in this.listQueue) {
        this.listQueue[name].process(job => {
            const event = EventFactory.getEvent(job.data);
            return event.execute();
        });
    }
}
```