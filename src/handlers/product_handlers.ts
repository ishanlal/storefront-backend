import express from 'express';
import { Product, ProductStore } from '../models/product';
import Client from '../database';
import jwt from 'jsonwebtoken';

const store = new ProductStore();
const secret = process.env.TOKEN_SECRET;

const index = async (_req: express.Request, res: express.Response) => {
  try{
  const products = await store.index();
  res.json(products);
} catch(err) {
    res.status(400);
    res.json(err);
}
}

const show = async (_req: express.Request, res: express.Response) => {
  try{
   const product = await store.show(_req.body.id);
   res.json(product);
 } catch(err) {
     res.status(400);
     res.json(err);
 }
}

const create = async (_req: express.Request, res: express.Response) => {
    try {
        const product: Product = {
            id: _req.body.id,
            name: _req.body.name,
            price: _req.body.price,
            category: _req.body.category
        }
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const destroy = async (_req: express.Request, res: express.Response) => {
  try{
    const deleted = await store.delete(_req.body.id);
    res.json(deleted);
  } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const category = async (_req: express.Request, res: express.Response) => {
  try{
   const product = await store.category(_req.body.category);
   res.json(product);
 } catch(err) {
     res.status(400);
     res.json(err);
 }
}

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

const product_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products', verifyAuthToken, destroy);
  app.get('/products/:category', category);
}

export default product_routes;
