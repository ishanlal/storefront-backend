import Client from '../database';

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
}

export class ProductStore{
  async index(): Promise<Product[]> {
    try{
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch(err){
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }
  async show(id: number): Promise<Product> {
    try{
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch(err){
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }
  async create(p: Product): Promise<Product>{
    try{
      const sql = 'INSERT INTO products (id, name, price, category) VALUES ($1, $2, $3, $4) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [p.id, p.name, p.price, p.category]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch(err){
      throw new Error(`Could not add new product ${p.name}. Error: ${err}`);
    }
  }
  async category(category: string): Promise<string> {
    try{
      const sql = 'SELECT COUNT(*) FROM products WHERE category=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows[0].count;
    } catch(err){
      throw new Error(`Could not find product category ${category}. Error: ${err}`);
    }
  }
  async delete(id: number): Promise<Product>{
    try{
      const sql = 'DELETE FROM products WHERE id=($1)'
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch(err){
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }

}
