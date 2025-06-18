# Backend - Interview Preparation Platform

This is the backend API server for the Interview Preparation Platform. It provides RESTful APIs for user authentication, profile management, task management, and interview-related functionalities.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js for authentication (GitHub, Google OAuth)
- JWT for token-based authentication
- Joi for input validation
- bcrypt for password hashing

## Setup and Installation

1. Clone the repository and navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:

   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will start on `http://localhost:8000` by default.

## API Routes Overview

- `/api/users` - User management routes
- `/api/auth` - Authentication routes (signup, signin, OAuth)
- `/api/profile` - User profile routes
- `/api/tasks` - Task management routes
- `/api/interview` - Interview-related routes

## License

This project is licensed under the ISC License.
