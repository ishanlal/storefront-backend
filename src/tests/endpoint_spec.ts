import supertest from 'supertest';
import app from '../server';

const request = supertest(app);
let token: string;

describe('User endpoint tests: ', () => {
  beforeEach(async()=>{
    await createUser();
  });
  afterEach(async()=>{
    const response = await request.delete('/users').send({
      id: 1
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('gets the users index endpoint', async () => {
      const response = await request.get('/users').set({
        authorization: 'Bearer ' + token
      });
      expect(response.status).toBe(200);
  });
  it('gets the users show endpoint', async () => {
      const response = await request.get('/users/:id').send({id: 1}).set({
        authorization: 'Bearer ' + token
      });
      expect(response.status).toBe(200);
  });
});

describe('Product endpoint tests: ', () => {
  beforeEach(async()=>{
    // create user
    await createUser();
    // create product
    const response = await request.post('/products').send({
      id: 1,
      name: 'pen',
      price: 20,
      category: 'supplies'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  afterEach(async()=>{
    // delete product
    const prodResponse = await request.delete('/products').send({
      id: 1
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(prodResponse.status).toBe(200);
    // delete user
    const userResponse = await request.delete('/users').send({
      id: 1
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(userResponse.status).toBe(200);
  });

  it('gets the products index endpoint', async () => {
      const response = await request.get('/products').set({
        authorization: 'Bearer ' + token
      });
      expect(response.status).toBe(200);
  });
  it('gets the products show endpoint', async () => {
      const response = await request.get('/products/:id').send({id: 1}).set({
        authorization: 'Bearer ' + token
      });
      expect(response.status).toBe(200);
  });
  it('display product category endpoint', async () => {
    const response = await request.get('/products/:category').send({
      category: 'supplies'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
});

describe('Order endpoints: ', () => {
  beforeAll(async()=>{
    // create user
    await createUser();
  });
  afterAll(async()=>{
    // delete user
    const userResponse = await request.delete('/users').send({
      id: 1
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(userResponse.status).toBe(200);
  });

  // create 3 products
  it('create product endpoint', async () => {
    const response = await request.post('/products').send({
      id: 1,
      name: 'pen',
      price: 20,
      category: 'supplies'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('create product endpoint', async () => {
    const response = await request.post('/products').send({
      id: 2,
      name: 'pencil',
      price: 10,
      category: 'supplies'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('create product endpoint', async () => {
    const response = await request.post('/products').send({
      id: 3,
      name: 'cup',
      price: 15,
      category: 'utensils'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // count products by category
  it('count products by category endpoint', async () => {
    const response = await request.get('/products/:category').send({
      category: 'supplies'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // create first order
  it('create order endpoint', async () => {
    const response = await request.post('/orders').send({
      id: 1,
      status: 'open',
      user_id: '1'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // add products to first order
  it('add products to order endpoint', async () => {
    const response = await request.post('/orders/1/products').send({
      quantity: 1,
      productId: '1'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('add products to order endpoint', async () => {
    const response = await request.post('/orders/1/products').send({
      quantity: 2,
      productId: '2'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('add products to order endpoint', async () => {
    const response = await request.post('/orders/1/products').send({
      quantity: 1,
      productId: '3'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // test dashboard services endpoints
  it('test dashboard endpoint', async () => {
    const response = await request.get('/five-most-expensive');
    console.log('five-most-expensive: ', response.body);
    expect(response.status).toBe(200);
  });
  it('test dashboard endpoint', async () => {
    const response = await request.get('/products_in_orders');
    console.log('products_in_orders: ', response.body);
    expect(response.status).toBe(200);
  });
  it('test dashboard endpoint', async () => {
    const response = await request.get('/users-with-orders');
    console.log('users-with-orders: ', response.body);
    expect(response.status).toBe(200);
  });

  // update order status
  it('create order endpoint', async () => {
    const response = await request.put('/orders/1').set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // create second order
  it('create order endpoint', async () => {
    const response = await request.post('/orders').send({
      id: 2,
      status: 'open',
      user_id: '1'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // add product to second order
  it('add products to second order endpoint', async () => {
    const response = await request.post('/orders/2/products').send({
      quantity: 1,
      productId: '3'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // display open orders of userID
  it('display open orders of userID endpoint', async () => {
    const response = await request.get('/open-orders-by-user/1').set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // display closed orders of userID
  it('display closed orders of userID endpoint', async () => {
    const response = await request.get('/closed-orders-by-user/1').set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // delete orders
  it('delete orders endpoint', async () => {
    const response = await request.delete('/orders/1').set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('delete orders endpoint', async () => {
    const response = await request.delete('/orders/2').set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });

  // delete products
  it('delete products endpoint', async () => {
    const response = await request.delete('/products').send({id: 1}).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('delete products endpoint', async () => {
    const response = await request.delete('/products').send({id: 2}).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('delete products endpoint', async () => {
    const response = await request.delete('/products').send({id: 3}).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
});

async function createUser() {
  const response = await request.post('/users').send({
    id: 1,
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    password_digest: 'hehe'
  });
  token = response.body;
  expect(response.status).toBe(200);
}
