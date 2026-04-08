# 🎬 CineFlow API
> **A sophisticated, high-performance Movie & Review Management System built with Node.js, Express, and Mongoose.**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

---

## ✨ Features

*   **🎬 Comprehensive Movie CRUD**: Full lifecycle management for movie entries.
*   **💬 Dynamic Review System**: Seamlessly linked reviews with nested movie associations.
*   **🛡️ Data Integrity**: Strict schema validation using Mongoose ODM.
*   **⚡ Modern Architecture**: Clean, modular folder structure (MVC-inspired).
*   **🚀 Production Ready**: Pre-configured with CORS, Environment variables, and error handling.
*   **🔄 Async/Await Workflow**: Clean, readable, and non-blocking code.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime** | Node.js |
| **Framework** | Express.js (v5+) |
| **Database** | MongoDB |
| **Modeling** | Mongoose |
| **Environment** | Dotenv |
| **Security** | CORS |

---

## 📂 Project Architecture

```text
backend/
├── 📁 config/         # Database connection configuration
├── 📁 controllers/    # Business logic & request handling
├── 📁 models/         # Mongoose schemas & data models
├── 📁 routes/         # Express API route definitions
├── 📄 .env            # Environment configuration (Private)
├── 📄 index.js        # Application entry point & server initialization
└── 📄 test-requests.http # API testing suite (VS Code REST Client)
```

---

## 🔌 API Documentation

### 🎞️ Movie Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/movies` | Fetch all movies in the database |
| `GET` | `/movies/:id` | Retrieve detailed info for a single movie |
| `POST` | `/movies` | Register a new movie entry |
| `PUT` | `/movies/:id` | Update existing movie metadata |
| `DELETE` | `/movies/:id` | Remove a movie from the database |

### 💬 Review Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/movies/:id/reviews` | Retrieve all reviews for a specific movie |
| `POST` | `/movies/:id/reviews` | Post a new review linked to a movie |
| `PUT` | `/reviews/:id` | Update an existing review |
| `DELETE` | `/reviews/:id` | Permanently delete a review |

---

## 🚀 Getting Started

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) installed
*   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to backend
cd backend

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/movie_db
```

### 4. Launch
```bash
# Development mode (Hot reload)
npm run dev

# Production mode
npm start
```

---

## 🧪 Testing the API

We've included a comprehensive `test-requests.http` file. If you use VS Code, install the **REST Client** extension to run tests directly from your editor.

```http
### Example: Create a Movie
POST http://localhost:5000/movies
Content-Type: application/json

{
  "title": "Interstellar",
  "description": "A team of explorers travel through a wormhole in space.",
  "year": 2014
}
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---
<p align="center">
  Developed with ❤️ for the Cinema Community
</p>
