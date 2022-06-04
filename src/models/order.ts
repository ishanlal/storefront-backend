import Client from '../database';
import bcrypt from 'bcrypt';

const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

export type Order = {
  id: number;
  status: string;
  user_id: string;
}

export type OrderProducts = {
  id: number;
  quantity: number;
  order_id: string;
  product_id: string;
}

export class OrderStore{
  async index(): Promise<Order[]> {
    try{
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch(err){
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }
  async show(id: number): Promise<Order> {
    try{
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch(err){
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }
  async create(o: Order): Promise<Order>{
    try{
      const sql = 'INSERT INTO orders (id, status, user_id) VALUES ($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [o.id, o.status, o.user_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch(err){
      throw new Error(`Could not add new order ${o.id}. Error: ${err}`);
    }
  }

    async addProduct(quantity: number, orderId: string, productId: string): Promise<OrderProducts> {
        // get order to see if it is open
        try {
          const ordersql = 'SELECT * FROM orders WHERE id=($1)'
          //@ts-ignore
          const conn = await Client.connect();
          const result = await conn.query(ordersql, [orderId]);
          const order = result.rows[0];
          if (order.status !== "open") {
            throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`)
          }
          conn.release();
        } catch (err) {
          throw new Error(`${err}`);
        }
        try {
          const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
          //@ts-ignore
          const conn = await Client.connect();
          const result = await conn.query(sql, [quantity, orderId, productId]);
          const order = result.rows[0];
          conn.release();
          return order;
        } catch (err) {
          throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
        }
      }
      async update(o: Order): Promise<Order>{
        try{
          const sql = 'UPDATE orders SET status=($2) WHERE id=($1)';
          const conn = await Client.connect();
          o.status = o.status == 'open' ? 'closed' : 'open';
          const result = await conn.query(sql, [o.id, o.status]);
          const order = result.rows[0];
          conn.release();
          return order;
        } catch(err){
          throw new Error(`Could not update order ${o.id}. Error: ${err}`);
        }
      }
      async delete(id: number): Promise<Order>{
        try{
          const sql = 'DELETE FROM orders WHERE id=($1)';
          const conn = await Client.connect();
          const result = await conn.query(sql, [id]);
          const order = result.rows[0];
          conn.release();
          return order;
        } catch(err){
          throw new Error(`Could not delete order ${id}. Error: ${err}`);
        }
      }
      async openOrders(id: number): Promise<string>{
        try{
          const sql = `SELECT COUNT (*) FROM orders WHERE status='open' AND user_id=($1)`;
          const conn = await Client.connect();
          const result = await conn.query(sql, [id]);
          const order = result.rows[0].count;
          conn.release();
          return order;
        } catch(err){
          throw new Error(`Could not count open orders for userID: ${id}. Error: ${err}`);
        }
      }
      async closedOrders(id: number): Promise<string>{
        try{
          const sql = `SELECT COUNT (*) FROM orders WHERE status='closed' AND user_id=($1)`;
          const conn = await Client.connect();
          const result = await conn.query(sql, [id]);
          const order = result.rows[0].count;
          conn.release();
          return order;
        } catch(err){
          throw new Error(`Could not count closed orders for userID: ${id}. Error: ${err}`);
        }
      }
}
