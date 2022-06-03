import {User, UserStore} from '../user';
import bcrypt from 'bcrypt';

const store = new UserStore();
const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

describe ("User Model", () =>{
  it('should have an index method', ()=>{
    expect(store.index).toBeDefined();
  });
  it('should have a show method', () => {
      expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
      expect(store.create).toBeDefined();
    });
    it('should have an authenticate method', () => {
      expect(store.authenticate).toBeDefined();
    });
    it('should have a delete method', () => {
      expect(store.delete).toBeDefined();
    });

    /*it('create method should add a user', async function create() {
      const result = await store.create({
        id: 1,
        username: 'firstUser',
        password_digest: `haha`
      });
      expect(result.id).toEqual(1);
      expect(result.username).toEqual('firstUser');
      expect(bcrypt.compareSync('haha'+pepper, result.password_digest)).toBe(true);
    });*/

xdescribe ("Test user create and delete functions", () =>{
  beforeEach(async()=>{
    await create();
  });
  it('delete method should remove the user', async () => {
    const d = await store.delete(1);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});

xdescribe ("Test Show and Index functions", () =>{
    beforeEach(async()=>{
      await create();
    });
    afterEach(async()=>{
      await store.delete(1);
    });
    it('index method should return a list of users', async () => {
      const result = await store.index();
      expect(result.length).toEqual(1);
    });
    it('show method should return the correct user', async () => {
      const result = await store.show(1);
      expect(result.id).toEqual(1);
      expect(result.username).toEqual('firstUser');
      expect(bcrypt.compareSync('haha'+pepper, result.password_digest)).toBe(true);
    });
  });
  });

  async function create() {
    const result = await store.create({
      id: 1,
      username: 'firstUser',
      password_digest: `haha`
    });
    expect(result.id).toEqual(1);
    expect(result.username).toEqual('firstUser');
    expect(bcrypt.compareSync('haha'+pepper, result.password_digest)).toBe(true);
  }
