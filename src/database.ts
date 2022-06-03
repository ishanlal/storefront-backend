import 'dotenv/config';
import { Pool } from 'pg'; // postgres library

const {
POSTGRES_HOST,
POSTGRES_DB,
POSTGRES_USER,
POSTGRES_PASSWORD,
POSTGRES_TEST,
ENV
} = process.env

let client: Pool;
console.log('ENV: ', ENV);

// connect to database
if(ENV === 'test'){
  console.log('new pool for test');
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}
else {
  console.log('new pool for dev');
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

export default client;
