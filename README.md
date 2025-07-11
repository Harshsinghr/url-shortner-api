# Mini URL Shortener API

## Overview
This is a backend API for a URL shortening service, built for the Oro Backend Intern assignment. It uses Node.js, Express, and MongoDB to create, store, and redirect short URLs, with features including URL validation, rate limiting, click tracking, and expiration.

## Setup
1. **Install MongoDB**: Follow the [MongoDB Docs](https://www.mongodb.com/docs/manual/installation/) to install MongoDB Community Edition.
2. **Install mongosh**: Download from [MongoDB Shell](https://www.mongodb.com/try/download/shell) to interact with the database.
3. **Start MongoDB**: In an admin PowerShell, run:
   ```bash
   net start MongoDB
   ```
4. **Clone this repository**:
   ```bash
   git clone https://github.com/yourusername/mini-url-shortener.git
   cd mini-url-shortener
   ```
5. **Install dependencies**:
   ```bash
   npm install
   ```
6. **Create `.env` file** in the project root:
   ```
   MONGODB_URI=mongodb://localhost:27017/short-url
   PORT=8001
   BASE_URL=http://localhost:8001
   ```
7. **Run the API**:
   ```bash
   npm start
   ```
   - The server starts at `http://localhost:8001`.

## Endpoints
- **POST `/url`**:
  - **Body**: `{ "url": "https://example.com" }`
  - **Response**: `{ "shortUrl": "http://localhost:8001/<shortId>" }`
  - Creates a short URL with a 10-day expiration.
- **GET `/url/:code`**:
  - Redirects to the original URL and tracks the visit.
  - Errors: `404` (URL not found), `410` (URL expired).

## Features
- ✔️**URL Validation**: Uses `validator.isURL` to ensure valid URLs.
- 💼**Rate Limiting**: Limits to 100 requests per 15 minutes using `express-rate-limit`.
- 📑**Click Tracking**: Stores visit timestamps in MongoDB (`visitHistory`).
- ⌚**Expiration**: URLs expire after 10 days (`expiresAt`).

## Testing
- **Postman**:
  - Import `postman_collection.json` (included in the repository) into Postman.
  - Use the "Shorten URL" request to send POST `/url`.
  - Use the "Redirect URL" request to send GET `/url/:code`.
- **curl**:
  ```bash
  curl -X POST http://localhost:8001/url -H "Content-Type: application/json" -d '{"url": "https://example.com"}'
  curl http://localhost:8001/url/<shortId> -L
  ```
- **Database Verification**:
  - Connect via:
    ```bash
    mongosh "mongodb://localhost:27017"
    ```
  - Run:
    ```javascript
    use short-url
    db.urls.find()
    ```
  - Check `shortId`, `redirectURL`, `visitHistory`, and `expiresAt`.

## Dependencies
- dotenv@17.2.0
- express-rate-limit@7.5.1
- express@5.1.0
- mongoose@8.16.3
- nanoid@5.1.5
- nodemon@3.1.10
- validator@13.15.15

## Notes:
- The `.env` file is excluded via `.gitignore` for security.
- The API has been tested with Postman and `mongosh`, confirming all features work as expected.
- For rate limiting, send 101 POST requests to trigger a `429 Too Many Requests` response.
- For expiration, modify `controllers/url.js` to set `expiresAt` to 10 seconds for testing.
