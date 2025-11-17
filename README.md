

# Book Bay - Backend

This repository contains the backend service for the Book Bay application, a digital product platform with a complete referral and credit system.

The system allows users to register, receive a unique referral code, and earn credits when their referred users make their first purchase. It's built with a focus on clean architecture, scalability, and data integrity.

**Live App url (Vercel)** - https://book-bay-eight.vercel.app/ \
**Backend url (Render)** - https://book-bay-backend.onrender.com/ \
**Frontend repository url** - https://github.com/vikram42003/book-bay

**This repo is mainly for detailing the backend and the API routes, please check out the frontend repo here for a complete overview of the project, including Entity Relationship and UML diagrams for backend and the app flow, complete tech stack and more**

---

## Features

*   **User Authentication**: Secure user registration and login using JWT for session management.
*   **Data Integrity & Performance**: Uses advanced database features like MongoDB indices and transactions to ensure high database performance, data integrity, and ACID compliance.
*   **Referral Management**: Each user gets a unique referral code upon registration. The system tracks the relationship between referrers and referred users.
*   **Reliable Credit System**: Both the referrer and the new user earn 2 credits after the new user's first purchase. Logic is in place to prevent double-crediting.
*   **Purchase Simulation**: Endpoints to simulate a user purchasing items.
*   **Developer-Focused**: Special development-only routes for easier testing and database seeding/cleaning.

---

## Tech Stack

*   **Framework**: Node.js with Express.js
*   **Language**: TypeScript
*   **Database**: MongoDB with Mongoose for object data modeling.
*   **Authentication**: JSON Web Tokens (JWT)
*   **Validation**: Server-side validation to ensure data integrity.

---

## Getting Started

Follow these instructions to get the backend server up and running on your local machine.

### **Prerequisites**

*   Node.js (v18.x or higher recommended)
*   npm, pnpm, yarn etc
*   MongoDB (local instance or a cloud-hosted version like MongoDB Atlas)

I prefer to use pnpm. Substitute the commands with your package manager equivalent.
eg. `yarn install` => `npm install`
### **1. Clone the Repository**

```bash
git clone https://github.com/vikram42003/book-bay-backend
cd book-bay-backend
```

### **2. Install Dependencies**

```bash
npm install
# or
pnpm install
# or
yarn install
```

### **3. Set Up Environment Variables**

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the required values:

*   `PORT`: The port the server will run on (e.g., 3003).
*   `MONGODB_URL`: Your MongoDB connection string.
*   `JWT_SECRET`: A long, random string for signing tokens. You can generate one with `openssl rand -base64 32`.
*   `NODE_ENV`: Set to `development` to enable helpful dev-only routes, otherwise it defaults to `production`.

### **4. Seed the database**
The app has a database seeding script that fetches the specified number of books from Google Books API and seeds the database with it.

```bash
npm run seed
# or
pnpm run seed
# or
yarn run seed
```

### **5. Run the Server**

```bash
npm run dev
# or
pnpm run dev
# or
yarn run dev
```

The server will start, and you should see a confirmation message in your console.

---

## API Endpoints

**Base URL:** `http://localhost:3003`

### **Postman Collection**

To easily test all available endpoints, import the Postman collection found at:

```
/postman/Book-Bay-API.postman_collection.json
```

It includes all endpoints with example requests, responses, and required authentication setups.

Below is a quick summary of the main API endpoints.
For full examples, refer to the included Postman collection.

---

### **Books**

#### **GET /api/books**

Returns a list of all books available in the store.
* **Returns:** Array of books (id, title, author, image, price, timestamps)
* **Errors:** None

---

### **Users**

#### **POST /api/users/register**

Creates a new user account.

* **Body:** `username`, `password`, `referralCode` *(optional)*
* **Returns:** JWT token + created user details
* **Errors:**

  * `409` User already exists
  * `400` Invalid/missing fields

#### **POST /api/users/login**

Logs in a user and issues a JWT.

* **Body:** `username`, `password`
* **Returns:** JWT token + user details
* **Errors:**

  * `401` Invalid login credentials

#### **GET /api/users/me**

Fetches the currently authenticated user’s profile.

* **Auth:** Requires Bearer Token
* **Returns:** User info (username, referralCode, credits, referralStatus, timestamps)
* **Errors:**

  * `401` Unauthorized / Missing Token

#### **GET /api/users**

Returns a list of all registered users.

* **Returns:** Array of user objects (without passwords)
* **Errors:** None

#### **DELETE /api/users/:id**

<DEVONLY - only available when NODE_ENV=development for the time being. use it for testing\>

Deletes a user by ID.

* **Auth:** Not required *(optional to protect – but currently open)*
* **Returns:** Deleted user details
* **Errors:**

  * `404` User not found

---

### **Purchases / Orders**

#### **GET /api/orders**

Returns all orders.

* **Auth:** Requires Bearer Token
* **Returns:** Array of orders with populated order items and book details
* **Errors:**

  * `401` Unauthorized

#### **POST /api/orders**

Creates a new purchase (order).

* **Auth:** Requires Bearer Token
* **Body:**

  * `items`: array of `{ bookId, quantity }`
  * `total`: number
* **Returns:** Created order with order items
* **Errors:**

  * `400` Missing/invalid data

---

### **Referrals**

#### **GET /api/referrals/stats/:userId**

Returns referral statistics for a user.

* **Auth:** Not required
* **Returns:** `{ total, converted }`
* **Errors:**

  * `404` If no referral stats found

---

### **Error Handling**

The API returns structured error responses.

Example:
`401 Unauthorized` when no token is provided to a protected route.

---
