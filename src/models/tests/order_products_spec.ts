import {Order, OrderStore} from '../order';
import {Product, ProductStore} from '../product';
import {User, UserStore} from '../user';
import bcrypt from 'bcrypt';

const Ostore = new OrderStore();
const Pstore = new ProductStore();
const Ustore = new UserStore();
const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

xdescribe ("Order Products Model", () =>{

  it('should have an index method', ()=>{
    expect(Ostore.index).toBeDefined();
  });
  it('should have a show method', () => {
      expect(Ostore.show).toBeDefined();
  });
  it('should have a create method', () => {
      expect(Ostore.create).toBeDefined();
  });
  it('should have an index method', ()=>{
    expect(Pstore.index).toBeDefined();
  });
  it('should have a show method', () => {
      expect(Pstore.show).toBeDefined();
  });
  it('should have a create method', () => {
      expect(Pstore.create).toBeDefined();
  });
  // create user
  beforeAll(async()=>{
    await create();
  });
  // delete user after tests
  afterAll(async()=>{
    await Ustore.delete(1);
  });
  // create three products
  it('create a product', async ()=>{
  const result = await Pstore.create({
    id: 1,
    name: 'pen',
    price: 20
  });
  expect(result).toEqual({
    id: 1,
    name: 'pen',
    price: 20
  });
  });
  it('create a product', async ()=>{
  const result = await Pstore.create({
    id: 2,
    name: 'pencil',
    price: 10
  });
  expect(result).toEqual({
    id: 2,
    name: 'pencil',
    price: 10
  });
  });
  it('create a product', async ()=>{
  const result = await Pstore.create({
    id: 3,
    name: 'cup',
    price: 15
  });
  expect(result).toEqual({
    id: 3,
    name: 'cup',
    price: 15
  });
  });
  // create an order
  it('create an order', async ()=>{
  const result = await Ostore.create({
    id: 1,
    status: 'open',
    user_id: '1'
  });
  expect(result).toEqual({
    id: 1,
    status: 'open',
    user_id: '1'
  });
  });
  // add products to open order
  it('add products to order', async ()=>{
  const result = await Ostore.addProduct(1, '1', '1');
  expect(result).toEqual({
    id: 1,
    quantity: 1,
    order_id: '1',
    product_id: '1'
  });
  });
  it('add products to order', async ()=>{
  const result = await Ostore.addProduct(2, '1', '2');
  expect(result).toEqual({
    id: 2,
    quantity: 2,
    order_id: '1',
    product_id: '2'
  });
  });
  it('add products to order', async ()=>{
  const result = await Ostore.addProduct(1, '1', '3');
  expect(result).toEqual({
    id: 3,
    quantity: 1,
    order_id: '1',
    product_id: '3'
  });
  });

});
async function create() {
  const result = await Ustore.create({
    id: 1,
    username: 'firstUser',
    password_digest: `haha`
  });
  expect(result.id).toEqual(1);
  expect(result.username).toEqual('firstUser');
  expect(bcrypt.compareSync('haha'+pepper, result.password_digest)).toBe(true);
}
