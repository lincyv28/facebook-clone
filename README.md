# Facebook Clone

A full-stack social media web application inspired by Facebook, built from scratch using the MERN stack (MongoDB, Express, React, Node.js). This project covers authentication, posts, likes, comments, search, and real-time-style notifications.

**Live Demo:** https://facebook-clone-frontend-omega.vercel.app

---

## Features

- **Authentication** — Register, Login, JWT-based sessions, protected routes, logout
- **User Profiles** — Edit profile info, upload profile picture
- **Posts** — Create posts with text and/or images, edit, delete, view details
- **News Feed** — Paginated feed with "Load More", loading states
- **Likes** — Like/unlike posts with live count updates
- **Comments** — Add and delete comments on posts
- **Search** — Search for users and posts in real time
- **Notifications** — Get notified when someone likes or comments on your post

---

## Tech Stack

**Frontend:** React (Vite), React Router, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB (MongoDB Atlas in production)
**Authentication:** JWT (JSON Web Tokens), bcrypt.js for password hashing
**File Uploads:** Multer
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## Project Structure

```
facebook-clone/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, Sidebars, Feed, CreatePost, ProtectedRoute
│   │   ├── pages/            # Login, Register, Home, Profile, PostDetails
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env                  # VITE_API_URL (not committed)
│
├── server/                  # Express backend
│   ├── models/               # User.js, Post.js, Notification.js
│   ├── routes/                # authRoutes, userRoutes, postRoutes, searchRoutes, notificationRoutes
│   ├── middleware/            # authMiddleware.js (JWT verification)
│   ├── uploads/               # Uploaded images
│   ├── server.js
│   └── .env                   # PORT, MONGO_URI, JWT_SECRET (not committed)
│
└── README.md
```

---

## Getting Started Locally

### Prerequisites
- Node.js and npm installed
- MongoDB installed locally, or a MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/lincyv28/facebook-clone.git
cd facebook-clone
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd client
npm install
```

Create a `.env` file inside `client/`:
```
VITE_API_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/users/profile` | Get logged-in user's profile |
| PUT | `/api/users/profile` | Update profile info |
| POST | `/api/users/profile/upload` | Upload profile picture |
| GET | `/api/posts` | Get paginated posts |
| POST | `/api/posts` | Create a new post |
| GET | `/api/posts/:id` | Get a single post |
| PUT | `/api/posts/:id` | Edit a post (owner only) |
| DELETE | `/api/posts/:id` | Delete a post (owner only) |
| PUT | `/api/posts/:id/like` | Like/unlike a post |
| POST | `/api/posts/:id/comment` | Add a comment |
| DELETE | `/api/posts/:postId/comment/:commentId` | Delete a comment (owner only) |
| GET | `/api/search?q=` | Search users and posts |
| GET | `/api/notifications` | Get user's notifications |
| PUT | `/api/notifications/mark-read` | Mark notifications as read |

---

## Development Process

This project was built incrementally across 14 modules:

1. Project Setup
2. UI Layout
3. Authentication UI
4. Authentication APIs
5. Auth Integration
6. User Profile
7. Create Post
8. News Feed
9. Post Actions
10. Like Feature
11. Comment Feature
12. Search Module
13. Notifications
14. Testing & Deployment

---

## Author

**Lincy V** — [GitHub: lincyv28](https://github.com/lincyv28)

---

## License

This project is for educational purposes as part of a full-stack development learning exercise.