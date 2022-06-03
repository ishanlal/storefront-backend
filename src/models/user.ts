import Client from '../database';
import bcrypt from 'bcrypt';

const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class UserStore{
  async index(): Promise<User[]> {
    try{
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch(err){
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }
  async show(id: number): Promise<User> {
    try{
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch(err){
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }
  async create(u: User): Promise<User>{
    try{
      const sql = 'INSERT INTO users (id, username, firstName, lastName, password) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(u.password + pepper, parseInt((saltRounds as unknown as string)));
      const result = await conn.query(sql, [u.id, u.username, u.firstName, u.lastName, hash]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch(err){
      throw new Error(`Could not add new user ${u.username}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<User>{
    try{
      const sql = 'DELETE FROM users WHERE id=($1)'
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch(err){
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
