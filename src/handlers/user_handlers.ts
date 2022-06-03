import express from 'express';
import { User, UserStore } from '../models/user';
import Client from '../database';
import jwt from 'jsonwebtoken';

const store = new UserStore();
const secret = process.env.TOKEN_SECRET;

const index = async (_req: express.Request, res: express.Response) => {
  const users = await store.index();
  res.json(users);
}

const show = async (_req: express.Request, res: express.Response) => {
   const user = await store.show(_req.body.id);
   res.json(user);
}

const create = async (_req: express.Request, res: express.Response) => {
  const user: User = {
    id: _req.body.id,
    username: _req.body.username,
    password_digest: _req.body.password_digest
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
    const deleted = await store.delete(_req.body.id);
    res.json(deleted);
}

const authenticate = async (_req: express.Request, res: express.Response) => {
  const user: User = {
    id: _req.body.id,
    username: _req.body.username,
    password_digest: _req.body.password_digest,
  }
  try {
      const u = await store.authenticate(user.username, user.password_digest);
      var token = jwt.sign({ user: u }, (secret as unknown as string));
      res.json(token);
  } catch(error) {
      res.status(401);
      res.json({ error });
  }
}

const update = async (_req: express.Request, res: express.Response) => {
    const user: User = {
        id: parseInt(_req.params.id),
        username: _req.body.username,
        password_digest: _req.body.password_digest,
    }
    /*try {
        let authorizationHeader = '';
        authorizationHeader = (_req.headers.authorization as unknown as string);
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, (secret as unknown as string));
        if((decoded as unknown as number) !== user.id) {
            throw new Error('User id does not match!')
        }
    } catch(err) {
        res.status(401);
        res.json(err);
        return;
    }*/

    try {
        const updated = await store.create(user)
        res.json(updated)
    } catch(err) {
        res.status(400)
        res.json((err as unknown as string) + user)
    }
}

const verifyAuthToken = (_req: express.Request, res: express.Response, next: any) => {
  console.log('UVAT called!!!');
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
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
  app.put('/users', verifyAuthToken, update);
  app.delete('/users', destroy);
  //app.post('/users/authenticate', authenticate);
}

export default user_routes;
