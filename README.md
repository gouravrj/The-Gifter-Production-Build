# The Gifter

Production-oriented MERN storefront for a premium handmade crafts business. It includes email-verified accounts, catalogue and inventory management, customization quotes, a persistent server-side cart, COD checkout, order tracking, and a protected admin studio.

## Local setup

Requirements: Node.js 20+, MongoDB, Gmail with an App Password, and an ImageKit private key.

1. Copy `server/.env.example` to `server/.env` and fill its values.
2. Copy `client/.env.example` to `client/.env`.
3. Run `npm install`, then `npm run install:all`.
4. Run `npm run dev`.

Storefront: http://localhost:5173
API: http://localhost:5000/api
Admin login: http://localhost:5173/admin

The API creates/updates the admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`, seeds all requested categories, and creates the default ₹1,000 resin rakhi at startup.

## Environment

Server variables: `NODE_ENV`, `PORT`, `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `IMAGEKIT_PRIVATE_KEY`, `GMAIL_USER`, and `GMAIL_APP_PASSWORD`.

Client variable: `VITE_API_URL`, for example `https://your-api.example.com/api`. Omit it when Express serves the client from the same domain.

Never commit `.env` files. Use a 32+ character random JWT secret and a Google App Password, not the normal Gmail password.

## Production deployment

For a single Node service:

- Build: `npm install && npm run install:all && npm run build`
- Start: `npm start`
- Health check: `/api/health`

Configure server variables in the host secret manager. Express serves `client/dist` and handles React Router fallbacks after the build. The included `render.yaml` is ready for Render. For separate hosting, build the client with `VITE_API_URL` and set API `CLIENT_URL` to the frontend origin.

Gmail SMTP suits an initial low-volume launch. Move to a transactional mail provider as OTP volume grows. The application intentionally exposes COD only; its order/payment boundary allows a gateway to be added later without rewriting cart or fulfillment logic.
