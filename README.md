__# CineReview API__

A sophisticated RESTful API for managing movie reviews, built with **Node.js**, **Express**, and **MongoDB**. This backend serves as a robust data layer for movie-related applications, providing seamless CRUD operations for user reviews.

---

__##🚀 Features##__

- **Full CRUD Operations:** Comprehensive management of movie reviews.
- **Robust Data Modeling:** Leverages Mongoose for schema validation and MongoDB Atlas integration.
- **Environment Driven:** Highly configurable via environment variables for different deployment stages.
- **Graceful Lifecycle Management:** Includes handlers for graceful shutdowns and connection management.
- **CORS Enabled:** Ready for cross-origin frontend integration.

---

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express 5](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **ODM:** [Mongoose](https://mongoosejs.com/)
- **Development Tools:** Nodemon, Dotenv

---

## 📂 Project Structure

```text
├── api/                # API Routes and Controllers
│   ├── reviews.controller.js
│   └── reviews.route.js
├── dao/                # Data Access Objects (Database logic)
│   └── reviewsDAO.js
├── index.js            # Entry point (Server & DB connection)
├── server.js           # Express app configuration
└── .env                # Environment variables (not tracked)
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=8000
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password
MONGO_CLUSTER=your_cluster.mongodb.net
MONGO_DB_NAME=moviesDB
# OR use a direct URI
# MONGO_URI=mongodb+srv://...
```

---

## 🏃 Running the Application

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 🔌 API Endpoints

### Reviews Base URL: `/api/v1/reviews`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/movie/:id` | Retrieve all reviews for a specific movie ID |
| **GET** | `/:id` | Retrieve a single review by its unique ID |
| **POST** | `/new` | Create a new movie review |
| **PUT** | `/:id` | Update an existing review |
| **DELETE** | `/:id` | Delete a review |

#### Request Examples (POST `/new`)
```json
{
  "movieId": "507f1f77bcf86cd799439011",
  "user": "John Doe",
  "review": "An absolute masterpiece!"
}
```

---

## 📜 License

Distributed under the [ISC License](https://opensource.org/licenses/ISC).
