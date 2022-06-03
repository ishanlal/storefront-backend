# storefront-backend

## Getting Started

This repo contains a basic Node and Express app to that contains an API for a storefront backend.

- To get started, clone this repo and run `npm install` in your terminal at the project root.

- **Copy paste the values below into a `.env` file placed at root directory level:**
`POSTGRES_HOST = 127.0.0.1
POSTGRES_DB = full_stack_dev
POSTGRES_TEST = full_stack_test
POSTGRES_USER = full_stack_user
POSTGRES_PASSWORD = password123
ENV=dev
BCRYPT_PASSWORD=secret_password
SALT_ROUNDS=10
TOKEN_SECRET=aloha`

- **Create users, orders ... products table using db-migrate library:**
`db-migrate create users-table --sql-file`
`db-migrate create orders-table --sql-file`
`db-migrate create products-table --sql-file`
`db-migrate create order-products-table --sql-file`

- To build project files run: `npm run build`
- To run DB migrations only run: `npm run migrate`
- To config runtime environments, build and run all jasmine and supertest tests run: `npm run test`

## Required Technologies
This application makes use of the following libraries:
- pg from npm for the Postgres database
- express from npm for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- bcrypt from npm for password hashing, salt & pepper
- typescript, jasmine and supertest from npm for testing

## Steps to Completion

### 1. Plan to Meet Requirements

In this repo there is a `REQUIREMENTS.md` document which outlines what the API supplies for the frontend, as well as the agreed upon data shapes to be passed between frontend and backend. This `README.md` is API documentation.

Updated `REQUIREMENTS.md` with the following:
- Determined the RESTful route for each endpoint listed. Added the RESTful route and corresponding HTTP verb to the document so that the frontend developer can begin to build their fetch requests.
**Example**:
`A SHOW route: 'blogs/:id' [GET]`

- Designed the Postgres database tables based off the data shape requirements. Added to the requirements document the database tables and columns with foreign keys if any.
**Example**:
`CREATE TABLE products (
    id SERIAL PRIMARY KEY, [foreign key to order_products table]
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL,
    category VARCHAR(64) NOT NULL
);`

**NOTE** It is important to remember that there might not be a one to one ratio between data shapes and database tables. Data shapes only outline the structure of objects being passed between frontend and API, the database may need multiple tables to store a single shape.

### 2.  DB Creation and Migrations

**Create all tables using db-migrate library and populate the up and down sql migrations:**
- **Example**: `db-migrate create users-table --sql-file`
- **Example**: up: `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    password VARCHAR
);`
- **Example**: down: `DROP TABLE users;`

### 3. Models

Models corresponding to each database table were created. The methods in each model map to the endpoints in `REQUIREMENTS.md`. Each model has test suites injecting mock data.

### 4. Express Handlers

Express handlers were written to route incoming requests to the correct model method. Endpoints are listed in `REQUIREMENTS.md`. Endpoints were tested using supertest.

### 5. JWTs and bcrypt

The password field on the user table was encrypted using the bcrypt library. JWTs were implemented for authenticating users for various route endpoints as listed in `REQUIREMENTS.md`.

### 6. QA and `README.md`

Project was spun up and each endpoint tested. Each endpoint test output responds with data that matches the data shapes from the `REQUIREMENTS.md`!
