import express from 'express';
import { Order, OrderStore } from '../models/order';
import Client from '../database';
import jwt from 'jsonwebtoken';

const store = new OrderStore();
const secret = process.env.TOKEN_SECRET;

// return all orders
const index = async (_req: express.Request, res: express.Response) => {
  try{
  const orders = await store.index();
  res.json(orders);
} catch(err) {
    res.status(400);
    res.json(err);
}
}

// return a order by ID
const show = async (_req: express.Request, res: express.Response) => {
  try{
   const order = await store.show(_req.body.id);
   res.json(order);
 }catch(err) {
     res.status(400);
     res.json(err);
 }
}

// create an order
const create = async (_req: express.Request, res: express.Response) => {
    try {
        const order: Order = {
            id: _req.body.id,
            status: _req.body.status,
            user_id: _req.body.user_id
        }
        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

// update order status
const update = async (_req: express.Request, res: express.Response) => {
    try {
      const order:Order = await store.show(parseInt(_req.params.id));
      const updatedOrder = await store.update(order);
      res.json(updatedOrder);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

// delete order
const destroy = async (_req: express.Request, res: express.Response) => {
  try{
    const deleted = await store.delete(parseInt(_req.params.id));
    res.json(deleted);
  } catch(err) {
      res.status(400);
      res.json(err);
  }
}

// return open orders of user ID
const openOrders = async (_req: express.Request, res: express.Response) => {
  try{
   const count: string = await store.openOrders(parseInt(_req.params.id));
   res.json(count);
 } catch(err) {
     res.status(400);
     res.json(err);
 }
}
// return closed orders of user ID
const closedOrders = async (_req: express.Request, res: express.Response) => {
  try{
   const count: string = await store.closedOrders(parseInt(_req.params.id));
   res.json(count);
 }catch(err) {
     res.status(400);
     res.json(err);
 }
}

// add products to order method
const addProduct = async (_req: express.Request, res: express.Response) => {
  const orderId: string = _req.params.id;
  const productId: string = _req.body.productId;
  const quantity: number = parseInt(_req.body.quantity)

  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId);
    res.json(addedProduct);
  } catch(err) {
    res.status(400);
    res.json(err);
  }
}

// authenticate method
const verifyAuthToken = (_req: express.Request, res: express.Response, next: Function) => {
    try {
      let authorizationHeader = '';
        authorizationHeader = (_req.headers.authorization as unknown as string);
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, (secret as unknown as string));
        next();
    } catch (error) {
        res.status(401);
    }
}

const order_routes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
  app.delete('/orders/:id', verifyAuthToken, destroy);
  app.put('/orders/:id', verifyAuthToken, update);
  app.get('/open-orders-by-user/:id', verifyAuthToken, openOrders);
  app.get('/closed-orders-by-user/:id', verifyAuthToken, closedOrders);
}

export default order_routes;
