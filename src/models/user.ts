import Client from '../database';
import bcrypt from 'bcrypt';

const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

export type User = {
  id: number;
  username: string;
  password_digest: string;
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
      const sql = 'INSERT INTO users (id, username, password_digest) VALUES ($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(u.password_digest + pepper, parseInt((saltRounds as unknown as string)));
      const result = await conn.query(sql, [u.id, u.username, hash]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch(err){
      throw new Error(`Could not add new user ${u.username}. Error: ${err}`);
    }
  }
  async authenticate(username: string, password: string): Promise<User | null> {
      const conn = await Client.connect();
      const sql = 'SELECT password_digest FROM users WHERE username=($1)';
      const result = await conn.query(sql, [username]);
      console.log(password+pepper);
      if(result.rows.length) {
        const user = result.rows[0];
        console.log(user);
        if (bcrypt.compareSync(password+pepper, user.password_digest)) {
          return user;
        }
      }
      return null;
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
