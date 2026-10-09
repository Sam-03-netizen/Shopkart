# ShopKart

ShopKart is a full-stack shopping application with a React storefront and an Express/MongoDB API. Customers can browse and filter products, manage a cart and wishlist, check out, and view their orders.

## Tech stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS 4
- **Backend:** Node.js, Express 5, Mongoose, JWT cookies
- **Payments:** Razorpay
- **Database:** MongoDB

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A running MongoDB instance
- Razorpay test credentials to exercise payment checkout

## Setup

Open two terminals from the repository root.

### 1. Configure the API

Create `server/.env` from the example:

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

The API listens on `http://localhost:8085` and connects to the MongoDB URL in `dbUrl`.

### 2. Start the storefront

In a second terminal from the repository root:

```powershell
cd client/vite-project
npm install
npm run dev
```

Vite serves the storefront at `http://localhost:5173`. The API client is configured for `http://localhost:8085`, and the API allows credentialed requests from the Vite development origin.

## Frontend scripts

Run these from `client/vite-project`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production assets into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

The backend package currently has no start or test script; start it with `node index.js`.

## API route groups

The backend mounts these route groups at the API root:

| Prefix | Purpose |
| --- | --- |
| `/customers` | Registration, login, logout, and customer endpoints |
| `/products` | Product listing, categories, and product details |
| `/wishlist` | Wishlist operations |
| `/cart` | Shopping cart operations |
| `/orders` | Checkout and order history/details |

## Project layout

```text
client/vite-project/   React storefront
server/                Express API and MongoDB models
```

