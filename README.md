# ShopKart

ShopKart is a full-stack shopping app with a React storefront and an Express/MongoDB API. Visitors can view the public landing page, then create an account or log in to browse products, manage a cart and wishlist, check out with Razorpay, and view their orders.

## Features

- Public landing page at `/` with links to sign up and log in
- Product catalog with search, category filters, and price sorting (account required in the storefront)
- Product detail pages, cart, and wishlist
- Customer registration, login, logout, and password change
- Razorpay checkout and order history
- Cookie-based JWT authentication

## Tech stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS 4
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB
- **Payments:** Razorpay

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- MongoDB, running locally or available through a connection URL
- Razorpay test credentials to exercise checkout

## Run locally

Open two terminals from the repository root.

### 1. Configure and start the API

Create the API environment file from the example:

```powershell
Copy-Item server/.env.example server/.env
```

Set the values in `server/.env`:

```dotenv
dbUrl=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=replace-with-a-long-random-secret
RAZORPAY_KEY_ID=your-razorpay-test-key-id
RAZORPAY_KEY_SECRET=your-razorpay-test-key-secret
```

Keep real credentials in `.env`; do not commit them. The checked-in `.env.example` contains placeholders.

Install dependencies and start the API:

```powershell
cd server
npm install
node index.js
```

The API listens on `http://localhost:8085`. Its port and CORS origin (`http://localhost:5173`) are currently set in `server/index.js`. The database connection reads `dbUrl` from `server/.env`.

### 2. Start the storefront

In a second terminal from the repository root:

```powershell
cd client/vite-project
npm install
npm run dev
```

Vite serves the storefront at `http://localhost:5173`. The Axios client uses `http://localhost:8085` and sends credentials so the browser can use the API's authentication cookie. The API CORS origin must match the storefront origin.

## Frontend scripts

Run these from `client/vite-project`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build production assets into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

The backend has no start script; use `node index.js` from `server/`. Its `npm test` command is a placeholder that exits with an error because backend tests are not configured.

## Routes

### Storefront

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/login` | Public | Customer login |
| `/register` | Public | Create an account |
| `/home` | Signed in | Storefront home |
| `/products` | Signed in | Browse and filter products |
| `/products/:id` | Signed in | Product details |
| `/wishlist` | Signed in | Saved products |
| `/cart` | Signed in | Shopping cart |
| `/checkout` | Signed in | Checkout |
| `/orders` | Signed in | Order history |
| `/orders/:id` | Signed in | Order details |
| `/order-success/:id` | Signed in | Payment confirmation |

### API

The API base URL is `http://localhost:8085`. Routes marked **Signed in** require the JWT session cookie.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/customers/register` | Public | Register a customer |
| `POST` | `/customers/login` | Public | Log in |
| `POST` | `/customers/logout` | Signed in | Log out |
| `GET` | `/customers/me` | Signed in | Get the current customer |
| `PATCH` | `/customers/change-password` | Signed in | Change password |
| `GET` | `/products` | Public | List products (supports search, category, and sort query parameters) |
| `GET` | `/products/categories` | Public | List product categories |
| `GET` | `/products/:id` | Public | Get product details |
| `POST` | `/products` | Public | Create a product (validated input) |
| `GET`, `POST`, `DELETE` | `/wishlist` | Signed in | Get, add, or remove wishlist items |
| `GET`, `POST`, `PATCH`, `DELETE` | `/cart` | Signed in | Get or modify cart items |
| `POST` | `/orders/create-payment-order` | Signed in | Create a Razorpay payment order |
| `POST` | `/orders/verify-payment` | Signed in | Verify payment |
| `GET` | `/orders` | Signed in | List customer orders |
| `GET` | `/orders/:id` | Signed in | Get an order |

## Project layout

```text
client/vite-project/   React storefront
server/                Express API, routes, controllers, and MongoDB models
```
