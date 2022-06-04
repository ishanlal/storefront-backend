import {Order, OrderStore} from '../order';
import {Product, ProductStore} from '../product';
import {User, UserStore} from '../user';
import bcrypt from 'bcrypt';

const Ostore = new OrderStore();
const Pstore = new ProductStore();
const Ustore = new UserStore();
const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

describe ("Order Product Model", () =>{

  // Order Store
  it('should have an index method', ()=>{
    expect(Ostore.index).toBeDefined();
  });
  it('should have a show method', () => {
      expect(Ostore.show).toBeDefined();
  });
  it('should have a create method', () => {
      expect(Ostore.create).toBeDefined();
  });
  it('should have a update method', () => {
      expect(Ostore.update).toBeDefined();
  });
  it('should have a addProduct method', () => {
      expect(Ostore.addProduct).toBeDefined();
  });
  it('should have a delete method', () => {
      expect(Ostore.delete).toBeDefined();
  });
  it('should have a openOrders method', () => {
      expect(Ostore.openOrders).toBeDefined();
  });
  it('should have a closedOrders method', () => {
      expect(Ostore.closedOrders).toBeDefined();
  });

  // Product Store
  it('should have an index method', ()=>{
    expect(Pstore.index).toBeDefined();
  });
  it('should have a show method', () => {
      expect(Pstore.show).toBeDefined();
  });
  it('should have a create method', () => {
      expect(Pstore.create).toBeDefined();
  });
  it('should have a category method', () => {
      expect(Pstore.category).toBeDefined();
  });
  it('should have a delete method', () => {
      expect(Pstore.delete).toBeDefined();
  });
});

describe ("User, Order, Product, Dashboard Test: ", () =>{
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
    price: 20,
    category: 'supplies'
  });
  expect(result).toEqual({
    id: 1,
    name: 'pen',
    price: 20,
    category: 'supplies'
  });
  });
  it('create a product', async ()=>{
  const result = await Pstore.create({
    id: 2,
    name: 'pencil',
    price: 10,
    category: 'supplies'
  });
  expect(result).toEqual({
    id: 2,
    name: 'pencil',
    price: 10,
    category: 'supplies'
  });
  });
  it('create a product', async ()=>{
  const result = await Pstore.create({
    id: 3,
    name: 'cup',
    price: 15,
    category: 'utensils'
  });
  expect(result).toEqual({
    id: 3,
    name: 'cup',
    price: 15,
    category: 'utensils'
  });
  });

  // count products by category
  it('count products by category', async ()=>{
  const result = await Pstore.category('supplies');
  expect(result).toEqual('2');
  });

  // create first order
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

  // add products to first order
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

  // update order status
  it('update order status', async ()=>{
  const result = await Ostore.update({
    id: 1,
    status: 'open',
    user_id: '1'
  });
  });

  // create second order
  it('create an order', async ()=>{
  const result = await Ostore.create({
    id: 2,
    status: 'open',
    user_id: '1'
  });
  expect(result).toEqual({
    id: 2,
    status: 'open',
    user_id: '1'
  });
  });

  // add a product to second order
  it('add products to order', async ()=>{
  const result = await Ostore.addProduct(1, '2', '1');
  expect(result).toEqual({
    id: 4,
    quantity: 1,
    order_id: '2',
    product_id: '1'
  });
  });

  // display open orders of userID
  it('display open orders of userID', async ()=>{
  const result = await Ostore.openOrders(1);
  expect(result).toEqual('1');
  });

  // display closed orders of userID
  it('display closed orders of userID', async ()=>{
  const result = await Ostore.closedOrders(1);
  expect(result).toEqual('1');
  });

  // delete orders
  it('delete order', async ()=>{
  const result = await Ostore.delete(1);
  });
  it('delete order', async ()=>{
  const result = await Ostore.delete(2);
  });

  // delete products
  it('delete product', async ()=>{
  const result = await Pstore.delete(1);
  });
  it('delete product', async ()=>{
  const result = await Pstore.delete(2);
  });
  it('delete product', async ()=>{
  const result = await Pstore.delete(3);
  });
  // end
});

// create user method
async function create() {
  const result = await Ustore.create({
    id: 1,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    password: `haha`
  });
  expect(result.id).toEqual(1);
  expect(result.username).toEqual('testuser');
  expect(bcrypt.compareSync('haha'+pepper, result.password)).toBe(true);
}
