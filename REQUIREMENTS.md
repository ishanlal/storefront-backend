# API Requirements
A companies stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. This API supports the above application for use in a frontend.

The API needs to supply the following endpoints as well as data shapes:

## API Endpoints
#### Products
- An INDEX route: 'products/' [GET]
- A SHOW route: 'products/:id' [GET]
- A CREATE route: 'products' [POST] [token required]
- A DELETE route: '/products' [DELETE] [token required]
- A DISPLAY route: 'products/:category' [GET]

#### Users
- An INDEX route: '/users' [GET] [token required]
- A SHOW route: '/users/:id' [GET] [token required]
- A CREATE route: '/users' [POST] [token required]
- A DELETE route: '/users' [DELETE] [token required]

#### Orders
- An INDEX route: '/orders' [GET]
- A SHOW route: '/orders/:id' [GET]
- A CREATE route: '/orders' [POST] [token required]
- A DELETE route: '/orders' [DELETE] [token required]
- An ADD PRODUCT route: '/orders/:id/products' [POST] [token required]
- A DISPLAY route: '/open-orders-by-user/:id' [GET] [token required]
- A DISPLAY route: '/closed-orders-by-user/:id' [GET] [token required]

#### Dashboard
- A DISPLAY route: '/five-most-expensive' [GET]
- A DISPLAY route: '/products_in_orders' [GET]
- A DISPLAY route: '/users-with-orders' [GET]

## Data Shapes
#### Products
- CREATE TABLE products (
    id SERIAL PRIMARY KEY, [foreign key to order_products table]
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL,
    category VARCHAR(64) NOT NULL
);

#### Users
- CREATE TABLE users (
    id SERIAL PRIMARY KEY, [foreign key to orders table]
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    password VARCHAR
);

#### Orders
- CREATE TABLE orders (
    id SERIAL PRIMARY KEY, [foreign key to order_products table]
    status VARCHAR(15),
    user_id bigint REFERENCES users(id) ON DELETE CASCADE [foreign key on users table]
);

#### Order_products
- CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id) ON DELETE CASCADE, [foreign key on orders table]
    product_id bigint REFERENCES products(id) ON DELETE RESTRICT [foreign key on products table]
);
