Classroom Project
Backend (server/)
Overview
This is the backend of the Classroom system, built with Node.js and Express, connected to Firebase Realtime Database. It supports user authentication, user management (students, instructors), lesson assignment, real-time chat, file uploads, email sending, and more.

Requirements
Node.js >= 16.x

Firebase Realtime Database (with Admin SDK service account)

SMTP email account (for sending emails)

Twilio account (for SMS-based authentication, if used)

Installation
bash
Copy
Edit
cd server
npm install
Configuration
Create a .env file in the server/ folder with the following variables:

ini
Copy
Edit
PORT=5000
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=your_twilio_phone
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password
Note:

Place the serviceAccountKey.json (Firebase Admin SDK) file inside the server/ directory.

DO NOT commit this file to GitHub (already ignored in .gitignore).

Run the Server
For production:

bash
Copy
Edit
npm start
For development (with hot reload):

bash
Copy
Edit
npm run dev
Available Scripts
npm start: Start the server normally

npm run dev: Start the server with nodemon for live reloading

npm run test: Run tests with Jest

npm run lint: Check code using ESLint

npm run lint:fix: Automatically fix lint issues

Key Files/Folders
server.js: Entry point of the Express app

firebase.js: Firebase Admin SDK setup

data.js: Data access logic

uploads/: Stores uploaded files (assignments, resources)

utils.js: Utility functions

Key API Endpoints
POST /addStudent: Add a new student

POST /addInstructor: Add a new instructor

GET /students: Get list of all students

GET /student/:phone: Get details of a specific student

PUT /editStudent/:phone: Edit student info

DELETE /student/:phone: Delete student

POST /assignLesson: Assign a lesson to students

POST /validateAccessCode: Validate access code (SMS)

POST /setRole: Set user role

POST /submitAssignment: Submit a lesson

... and many more (see server.js)

Realtime & Chat
Uses Socket.io for real-time 1-1 chat, notifications, and online status tracking.

Security Notes
Sensitive files such as .env, serviceAccountKey.json, and uploaded data are excluded from Git versioning.

.gitignore is configured properly to protect secrets.

Frontend (client/)
Overview
This is the frontend interface of the Classroom system, built with React, powered by Vite, styled with Material UI, using Socket.io-client and REST API for communication.

Requirements
Node.js >= 16.x

Installation
bash
Copy
Edit
cd client
npm install
Configuration
Create a .env file inside the client/ directory with the following example content:

ini
Copy
Edit
VITE_API_URL=http://localhost:5000
Make sure this endpoint matches your backend server address.

Run the Frontend
Development:

bash
Copy
Edit
npm run dev
Build for production:

bash
Copy
Edit
npm run build
Preview build output:

bash
Copy
Edit
npm run preview
Available Scripts
npm run dev: Start development server (hot reload)

npm run build: Build for production

npm run preview: Preview production build

npm run lint: Lint the code using ESLint

Key File Structure
src/: Main source code

components/: UI components (Admin, Instructor, Student, Chat, etc.)

pages/: Main pages (Dashboard, Login, Profile, etc.)

services/: API handlers for student, instructor, user, etc.

hooks/: Custom React hooks (e.g., useAuth)

assets/: Icons, images, etc.

public/: Static files, favicon

index.html: Root HTML file

Main Dependencies
react, react-dom: React core

@mui/material, @mui/icons-material: Material UI

axios: HTTP client

socket.io-client: Realtime connection with backend

firebase: Optional (for push notification / auth if needed)

react-router-dom: Routing

date-fns: Date/time handling

react-hot-toast: Toast notifications

Highlight Features
Login, registration, access code validation

Manage students, instructors, lessons

Assign, submit, and track progress of lessons

Real-time 1-on-1 chat between students and instructors

Admin dashboard for system management

Fully responsive modern UI

Security Notes
.env files, sensitive configs, and build outputs are excluded from Git (via .gitignore).

Never commit secrets or sensitive data to GitHub.