# ShopKart storefront

This folder contains the React storefront for ShopKart. The public landing page is at `/`; customer shopping features are available after logging in.

## Run locally

From this folder, install dependencies and start Vite:

```sh
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173`. The Express API must also be running at `http://localhost:8085`; see the [project setup guide](../../README.md#run-locally) for MongoDB, API environment variables, and Razorpay configuration. The API allows credentialed requests from the Vite development origin, and the storefront sends cookies with API requests.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build production assets into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Main routes

- `/` — public ShopKart landing page
- `/login` and `/register` — customer authentication
- `/home`, `/products`, `/wishlist`, `/cart`, `/checkout`, and `/orders` — signed-in storefront pages

The storefront uses React 19, React Router, Vite, and Tailwind CSS 4.
