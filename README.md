# 🎬 CineFlow API

> **An enterprise-grade, high-performance RESTful API for Movie & Review management, engineered with Node.js, Express, and Mongoose.**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/express-latest-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Code Style: Clean](https://img.shields.io/badge/code%20style-clean-blueviolet?style=for-the-badge)](https://github.com/clean-code-javascript)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

---

## ✨ Features

- **🎬 Advanced Movie Management**: Full CRUD operations with rich metadata handling (Title, Description, Year).
- **💬 Relational Review System**: Deeply integrated review engine with MongoDB `ObjectId` referencing for high-performance querying.
- **🛡️ Robust Data Integrity**: Strict schema enforcement and validation logic (ratings 1-10, required fields) powered by Mongoose.
- **🏗️ Clean Architecture**: Strict adherence to the MVC (Model-View-Controller) design pattern for maximum scalability and maintainability.
- **🛡️ Intelligent Error Handling**: Context-aware error responses (e.g., automated `CastError` detection for invalid resource IDs).
- **🚀 Production Ready**: Pre-configured with Cross-Origin Resource Sharing (CORS), environment isolation, and non-blocking asynchronous workflows.

---

## 🛠️ Tech Stack

| Category        | Technology                |
| :-------------- | :------------------------ |
| **Runtime**     | Node.js (LTS)             |
| **Framework**   | Express.js                |
| **Database**    | MongoDB Atlas / Community |
| **Modeling**    | Mongoose ODM              |
| **Environment** | Dotenv                    |
| **Middleware**  | CORS, Express JSON Parser |

---

## 📂 Project Architecture

```text
├── 📁 config/         # Database abstraction & connection pooling
├── 📁 controllers/    # Decoupled business logic & request orchestration
├── 📁 models/         # Data blueprints & Mongoose validation schemas
├── 📁 routes/         # RESTful endpoint definitions & nested routing
├── 📄 index.js        # Application bootstrap & middleware pipeline
├── 📄 .env            # Secure environment configuration
└── 📄 test-requests.http # Automated test suite for REST Client
```

---

## 🔌 API Documentation

### 🎞️ Movie Endpoints

| Method   | Endpoint      | Description                               |
| :------- | :------------ | :---------------------------------------- |
| `GET`    | `/movies`     | Fetch all movies in the database          |
| `GET`    | `/movies/:id` | Retrieve detailed info for a single movie |
| `POST`   | `/movies`     | Register a new movie entry                |
| `PUT`    | `/movies/:id` | Update existing movie metadata            |
| `DELETE` | `/movies/:id` | Remove a movie from the database          |

### 💬 Review Endpoints

| Method   | Endpoint              | Description                               |
| :------- | :-------------------- | :---------------------------------------- |
| `GET`    | `/movies/:id/reviews` | Retrieve all reviews for a specific movie |
| `POST`   | `/movies/:id/reviews` | Post a new review linked to a movie       |
| `PUT`    | `/reviews/:id`        | Update an existing review                 |
| `DELETE` | `/reviews/:id`        | Permanently delete a review               |

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### 2. Installation

```bash
# Clone the repository
git clone < https://github.com/ADN1SK/Movie-Site-backend.git >

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
