import express from 'express';
import { DashboardQueries } from '../services/dashboard';

const dashboard = new DashboardQueries();

const fiveMostExpensive = async (_req: express.Request, res: express.Response) => {
  try{
  const users = await dashboard.fiveMostExpensive();
  res.json(users);
} catch(err) {
    res.status(400);
    res.json(err);
}
}

const usersWithOrders = async (_req: express.Request, res: express.Response) => {
  try{
  const users = await dashboard.usersWithOrders();
  res.json(users);
} catch(err) {
    res.status(400);
    res.json(err);
}
}

const productsInOrders = async (_req: express.Request, res: express.Response) => {
  try{
  const products = await dashboard.productsInOrders();
  res.json(products);
} catch(err) {
    res.status(400);
    res.json(err);
}
}

const dashboard_routes = (app: express.Application) => {
    app.get('/five-most-expensive', fiveMostExpensive);
    app.get('/products_in_orders', productsInOrders);
    app.get('/users-with-orders', usersWithOrders);
}

export default dashboard_routes;
