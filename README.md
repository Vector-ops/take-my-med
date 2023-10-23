# TakeMyMed

Welcome to TakeMyMed, a robust reminder system designed to assist patients and their caretakers in managing scheduled reminders effectively. Below, you'll find detailed information on setting up, using, and understanding the features of this application.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech stack and Dependencies](#tech-stack-and-dependencies)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Database](#database)
- [Error Handling](#error-handling)

## Introduction

TakeMyMed is a Node.js-based web application that enables users to schedule and manage reminders via email notifications. It allows users to register, log in, add caretakers, create, update, and delete reminders. The system utilizes session-based authentication, Node-schedule for reminder scheduling, Redis for job storage, and Nodemailer for sending email notifications.

## Features

- **User Management:**
  - Users can register and log in.
  - Users can add caretakers via email.
  - Users can update their profile information.

- **Reminder Management:**
  - Users can schedule reminders.
  - Users can update and delete reminders.
  - Users can view all reminders.

- **Email Notifications:**
  - Email notifications are sent to users and their caretakers for scheduled reminders.

## Tech stack and Dependencies

- Node.js and npm
- Express
- MongoDB
- Mongoose
- Redis
- [Joi](https://github.com/sideway/joi) for input validation
- [dotenv](https://www.npmjs.com/package/dotenv) to store environment variables
- [Node-schedule](https://github.com/node-schedule/node-schedule) for scheduling reminders
- [Nodemailer](https://nodemailer.com/about/) for sending emails
- [Argon2](https://www.npmjs.com/package/argon2) for password hashing
- [Express](https://expressjs.com/) for the web server framework
- [http-errors](https://www.npmjs.com/package/http-errors) for efficient error handling
- [Nodemon](https://www.npmjs.com/package/nodemon) as dev dependency
- [Express-session](https://www.npmjs.com/package/express-session) to manage sessions
- [connect-mongodb-session](https://www.npmjs.com/package/connect-mongodb-session) to store sessions

## Installation

1. Clone the repository: `git clone https://github.com/Vector-ops/take-my-med.git`
2. Change directory `cd take-my-med`
3. Install dependencies: `npm install`
4. Set up MongoDB and Redis on your local machine or a remote server.
5. Create a `.env` file in the project root and configure environment variables:

```plaintext
MONGODB_URI=your-mongodb-uri
MONGO_DB=database
REDIS_URL=your-redis-url
SESSION_SECRET=your-session-secret
SMTP_HOST=your-smtp-host
EMAIL_PORT=your-smtp-port
EMAIL_USER=your-email-username
EMAIL_PASS=your-email-password
```

5. Run the application: `npm start`

## Usage

Once the application is running, you can access the API routes to manage reminders and user profiles.

## API Routes

### Authentication Routes:

- `POST /api/v1/auth/login`: Login (requires email and password in the request body)
- `POST /api/v1/auth/signup`: Register (requires email, name, and password in the request body)
- `GET /api/v1/auth/logout`: Logout

### User Routes:

- `GET /api/v1/user/profile`: Get the profile of the current user
- `GET /api/v1/user/:email`: Get the profile of the user with the specified email
- `PUT /api/v1/user/update`: Update user profile by adding caretakers or changing name

### Reminder Routes:

- `POST /api/v1/reminder/set`: Schedule a reminder
- `GET /api/v1/reminder/getAll`: Get all reminders
- `GET /api/v1/reminder/:id`: Get a reminder by ID
- `PUT /api/v1/reminder/:id`: Update a reminder by ID
- `DELETE /api/v1/reminder/:id`: Delete a reminder by ID

## Authentication

The system uses session-based authentication. Users need to log in to access protected routes. Session information is stored in MongoDB and managed via express-session and connect-mongodb-session packages. Authentication routes (`/api/v1/auth/login` and `/api/v1/auth/signup`) use Argon2 for password hashing and Joi for input validation.

## Database

- **MongoDB:** User profiles and reminder data are stored in a MongoDB database. Mongoose is used as an Object Data Modeling (ODM) library for MongoDB and Node.js.

- **Redis:** Redis is used to store job information related to scheduled reminders. Each job has a unique name generated for tracking and updating purposes.

## Error Handling

The system is equipped with proper error handling mechanisms. Errors related to input validation, authentication, database operations, and internal server issues are handled gracefully, returning appropriate HTTP status codes and error messages.

---

Thank you for using the Reminder System! If you have any questions or need further assistance, please don't hesitate to contact us.
