import express from 'express';
import bodyParser from 'body-parser';
import user_routes from './handlers/user_handlers';
import order_routes from './handlers/order_handlers';
import product_routes from './handlers/product_handlers';
import dashboard_routes from './handlers/dashboard_handlers';

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.get('/', function (req: express.Request, res: express.Response) {
    res.send('Hello World!')
});

user_routes(app);
order_routes(app);
product_routes(app);
dashboard_routes(app);

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
});

export default app;
