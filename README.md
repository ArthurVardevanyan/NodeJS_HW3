# NodeJS_Homework_3 ![Actions Status](https://github.com/ArthurVardevanyan/NodeJS_Homework_3/workflows/nodeJS/badge.svg)

### Requirements 


1. Automatically parse the incoming body as JSON
```Javascript
app.use(Express.json()); 
```

2. If the HTTP verb DELETE was used, then stop the propagation of the request and reply with a 405 status code.
```Javascript
app.delete('/', (req, res) => {
  res.status(StatusCodes.METHOD_NOT_ALLOWED).send(ReasonPhrases.METHOD_NOT_ALLOWED);
});
```
3. Verify that either a query string parameter called "date-validation" or a header with the same name (case insensitive) was supplied and has a value that represents an epoch time that is within +/- 5 minutes of the current time on the server.
    * If an in-spec date was provided in either location, then allow the request to continue (except for an edge case mentioned below).
        * If the request is allowed to continue, add a property to the request object called `dateValidation` that future middleware in the request chain can utilize.
    * If neither location supplied a date, or at least one of the two locations supplied an out-of-spec date, or the two locations provided a different date from each other (even if both dates are in-spec), then stop the propagation of the request and reply with a 401 status code.
        * Example: if the current date/time on the server is [Sunday, July 5, 2020 10:25:14 PM GMT-04:00 DST] (epoch: 1594002314), then the value of the date-validation field should be 1594002014 <= time <= 1594002614.

```Javascript
middleware/middleware.dateValidation.js
```

4. Log the entirety of the incoming request, including: current server time (epoch), HTTP verb, URL, body, query parameters, headers, and dateValidation field (from previous middleware).
```json
{
  "level": "info",
  "serverTime": 1616710093,
  "requestType": "GET",
  "url": "/",
  "body": {},
  "query": {},
  "headers": {
    "host": "127.0.0.1:41273",
    "accept-encoding": "gzip, deflate",
    "user-agent": "node-superagent/3.8.3",
    "date-validation": "1616710092.495",
    "connection": "close"
  },
  "dateValidation": 1616710092,
  "timestamp": "2021-03-25 18:08:13"
}
```
5. You should use the Winston logging library for Node.js to perform all logging tasks.
```Javascript
const winstonLogger = Winston.createLogger({
  transports: [
    new Winston.transports.Console({
      format: Winston.format.combine(
        Winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        Winston.format.json(),
      ),
    }),
  ],
});
```
```JavaScript
app.use('/', (req, res, next) => {
  winstonLogger.log({
    level: 'info',
    serverTime: req.epochTime,
    requestType: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    headers: req.headers,
    dateValidation: req.dateValidation,
  });
  next();
});
```
6. If the request is able to proceed through the first set of middleware, then all HTTP methods for the path "/" should randomly:

    * 50% of the time: 200 status code and the text "Hello World"
    * 50% of the time: throw an error with the message "Oops"
```Javascript
app.use('/', (req, res) => {
  const random = Math.round(Math.random());
  if (random === 1) {
    res.status(StatusCodes.OK).send('Hello World');
  } else {
    throw new Error('50% Failure');
  }
});
```
7. At the end of the middleware and routing chain, you should add one final middleware that catches any errors and sends the text "We're sorry, the error was: " ... along with the message from the exception that was thrown, and a 500 status code.
```JavaScript
app.use((err, req, res, next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`We're sorry, the error was: ${ReasonPhrases.INTERNAL_SERVER_ERROR}`);
});
```
