import express from 'express';
import { User, UserStore } from '../models/user';
import Client from '../database';
import jwt from 'jsonwebtoken';

const store = new UserStore();
const secret = process.env.TOKEN_SECRET;

const index = async (_req: express.Request, res: express.Response) => {
  try{
  const users = await store.index();
  res.json(users);
} catch(err) {
    res.status(400);
    res.json(err);
}
}

const show = async (_req: express.Request, res: express.Response) => {
  try{
   const user = await store.show(_req.body.id);
   res.json(user);
 } catch(err) {
     res.status(400);
     res.json(err);
 }
}

const create = async (_req: express.Request, res: express.Response) => {
  const user: User = {
    id: _req.body.id,
    username: _req.body.username,
    firstName: _req.body.firstName,
    lastName: _req.body.lastName,
    password: _req.body.password
  }
  try{
    const newUser = await store.create(user);
    let token = jwt.sign({ user: newUser }, (secret as unknown as string));
    res.json(token);
  } catch(err) {
    res.status(400);
    res.json((err as unknown as string)+user);
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

const user_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.delete('/users', verifyAuthToken, destroy);
}

export default user_routes;
