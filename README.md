# Interview Preparation Platform

A comprehensive full-stack Interview Preparation Platform designed to help users prepare for technical interviews through a rich set of features including interview practice, resume building, career planning, and community engagement.

---

## Architecture Overview

```
+----------------------+          REST API          +----------------------+
|                      | <------------------------> |                      |
|      Frontend        |                            |       Backend         |
|  (React + Vite SPA)  |                            | (Node.js + Express)   |
|                      |                            |                      |
+----------------------+                            +----------------------+
          |                                                      |
          |                                                      |
          |                                                      |
          v                                                      v
+----------------------+                            +----------------------+
|  React Router DOM    |                            |  MongoDB Database     |
|  State Management    |                            |  Mongoose ODM         |
|  UI Components       |                            |  Authentication      |
|  API Services        |                            |  Authorization       |
+----------------------+                            +----------------------+
```

---

## Key Features

### Frontend

- User authentication and authorization with OAuth (GitHub, Google)
- Interview scheduling and practice modules
- Resume creation and enhancement tools
- Career roadmap and personalized planning
- Community forums and event discovery
- Real-time notifications and feedback
- Responsive and accessible UI with Material UI, Ant Design, and Tailwind CSS

### Backend

- Secure RESTful API with Express.js
- User management and profile handling
- Task and interview session management
- Authentication with Passport.js and JWT
- Data validation with Joi
- Password hashing with bcrypt
- Session management and OAuth integrations

---

## User Workflow Diagram

```
User
  |
  v
[Login/Signup] ---> [Dashboard]
                        |
                        +--> [Interview Practice]
                        |
                        +--> [Resume Builder]
                        |
                        +--> [Career Roadmap]
                        |
                        +--> [Community & Events]
```

---

## Project Structure

```
/backend
  ├── config/           # Configuration files (DB, Passport strategies)
  ├── controller/       # Route controllers
  ├── middleware/       # Express middleware (auth, error handling)
  ├── models/           # Mongoose models
  ├── routes/           # API route definitions
  ├── utils/            # Utility functions
  ├── server.js         # Express app entry point
  └── package.json      # Backend dependencies and scripts

/client
  ├── public/           # Static assets
  ├── src/
  │   ├── assets/       # Images, icons, logos
  │   ├── components/   # Reusable React components
  │   ├── contexts/     # React context providers
  │   ├── lp/           # Landing page components
  │   ├── pages/        # Route pages
  │   ├── services/     # API service calls
  │   ├── utils/        # Utility functions
  │   ├── App.jsx       # Main app component
  │   └── index.jsx     # Entry point
  ├── package.json      # Frontend dependencies and scripts
  └── vite.config.js    # Vite configuration
```

---

## Environment Variables

| Variable               | Description                      | Required For    |
| ---------------------- | -------------------------------- | --------------- |
| `PORT`                 | Port number for backend server   | Backend         |
| `MONGODB_URI`          | MongoDB connection string        | Backend         |
| `JWT_SECRET`           | Secret key for JWT token signing | Backend         |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID           | Backend (OAuth) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret       | Backend (OAuth) |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID           | Backend (OAuth) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret       | Backend (OAuth) |

---

## Setup and Installation

### Backend

```bash
cd backend
npm install
# Create .env file with required variables
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open your browser at `http://localhost:5173` (or the port shown in terminal).

---

## Available Scripts

### Backend

- `npm start` - Start backend server

### Frontend

- `npm run dev` - Start frontend dev server
- `npm run build` - Build production frontend
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## Deployment Notes

- Ensure environment variables are set correctly in production
- Use process managers like PM2 for backend server
- Serve frontend build with static hosting or CDN
- Secure backend APIs with HTTPS and proper CORS settings

---

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

---

## License

This project is licensed under the ISC License.
