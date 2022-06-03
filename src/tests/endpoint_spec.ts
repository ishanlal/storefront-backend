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

xdescribe('Test User and Book endpoints: ', () => {
    beforeAll(async()=>{
      await createUser();
    });
    afterAll(async()=>{
      const response = await request.delete('/users').send({
        id: 1
      });
      expect(response.status).toBe(200);
    });
    /*it('post the users endpoint', async () => {
        const response = await request.post('/users').send({
          id: 1,
          username: 'JohnDoe',
          password_digest: 'hehe'
        });
        console.log(response.body);
        token = response.body;
        console.log(token);
        expect(response.status).toBe(200);
    });*/
    it('gets the users index endpoint', async () => {
        const response = await request.get('/users');
        expect(response.status).toBe(200);
    });
    it('gets the users show endpoint', async () => {
        const response = await request.get('/users/:id').send({id: 1});
        expect(response.status).toBe(200);
    });
  it('post the books endpoint', async () => {
    const response = await request.post('/books').send({
      id: 1,
      title: 'Bridge to Terabithia',
      author: 'Katherine Paterson',
      total_pages: 250,
      type: 'Childrens',
      summary: `a children's book`
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('gets the books index endpoint', async () => {
    const response = await request.get('/books');
    expect(response.status).toBe(200);
  });
  it('gets the books show endpoint', async () => {
    const response = await request.get('/books/:id').send({id: 1});
    expect(response.status).toBe(200);
  });
  it('delete the books endpoint', async () => {
    const response = await request.delete('/books').send({
      id: 1
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  /*it('delete the users endpoint', async () => {
      const response = await request.delete('/users').send({
        id: 1
      });
      expect(response.status).toBe(200);
  });*/
  // create products
  it('create product endpoint', async () => {
    const response = await request.post('/products').send({
      id: 1,
      name: 'pen',
      price: 20
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('create product endpoint', async () => {
    const response = await request.post('/products').send({
      id: 2,
      name: 'pencil',
      price: 10
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('create product endpoint', async () => {
    const response = await request.post('/products').send({
      id: 3,
      name: 'cup',
      price: 15
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  // create one order
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
  // add products to order
  it('add products to order endpoint', async () => {
    const response = await request.post('/orders/1/products').send({
      id: '1',
      quantity: 1,
      productId: '1'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('add products to order endpoint', async () => {
    const response = await request.post('/orders/1/products').send({
      id: '1',
      quantity: 2,
      productId: '2'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  it('add products to order endpoint', async () => {
    const response = await request.post('/orders/1/products').send({
      id: '1',
      quantity: 1,
      productId: '3'
    }).set({
      authorization: 'Bearer ' + token
    });
    expect(response.status).toBe(200);
  });
  // test dashboard endpoints
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
