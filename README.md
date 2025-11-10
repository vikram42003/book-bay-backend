

### **Postman Collection**

Import the collection found at:

```
/postman/Book-Bay-API.postman_collection.json
```

It includes all endpoints with example requests and responses.

---

## API Endpoints

**Base URL:** `http://localhost:3003`

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
