# Coinbase Clone — Backend API

Node.js/Express REST API with MongoDB for the Coinbase Clone project.

## Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT (HTTP-only cookies)

## Setup

```bash
npm install
cp .env.example .env   # fill in your values
npm start
```

## Environment Variables

| Variable        | Description                                  |
|-----------------|----------------------------------------------|
| `MONGODB_URI`   | MongoDB Atlas connection string              |
| `JWT_SECRET`    | Long random string for signing JWT tokens    |
| `CLIENT_ORIGIN` | Frontend URL (e.g. https://your-site.netlify.app) |
| `NODE_ENV`      | Set to `production` on Render                |

## API Endpoints

### Auth
| Method | Route       | Description                        |
|--------|-------------|------------------------------------|
| POST   | /register   | Create a new user account          |
| POST   | /login      | Authenticate and receive JWT cookie|
| POST   | /logout     | Clear the auth cookie              |
| GET    | /profile    | Get current user (auth required)   |

### Crypto
| Method | Route           | Description                        |
|--------|-----------------|------------------------------------|
| GET    | /crypto         | All cryptocurrencies (paginated)   |
| GET    | /crypto/gainers | Top gainers sorted by 24h change   |
| GET    | /crypto/new     | Newest listings                    |
| POST   | /crypto         | Add a new cryptocurrency           |

## Deployment (Railway)

1. Push this repo to GitHub Classroom (or any GitHub repo).
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
3. Select this repository.
4. Set the following environment variables in the Railway dashboard (**Variables** tab):

| Variable        | Value                                              |
|-----------------|----------------------------------------------------|
| `MONGODB_URI`   | Your MongoDB Atlas connection string               |
| `JWT_SECRET`    | A long random secret string                        |
| `CLIENT_ORIGIN` | Your deployed frontend URL (e.g. Netlify URL)      |
| `NODE_ENV`      | `production`                                       |

5. Railway will auto-detect Node.js, run `npm install`, and start with `node index.js` (via `railway.json`).
6. Once deployed, click **Generate Domain** in the Railway dashboard to get your public URL.
7. Visit `https://your-app.up.railway.app/health` — it should return `{"message":"API is running."}`.
