TaskFlow 🚀

A modern full-stack project management and collaboration platform built using React, Node.js, Prisma ORM, MySQL, Socket.IO, and Cloudinary.

🌟 Features
🔐 Authentication & Authorization
👥 Workspace Management
📁 Project Management
🎫 Kanban Ticket System
🧠 AI Ticket Suggestions
💬 Real-tfime Comments & Typing Indicators
⚡ Real-time Socket.IO Updates
📎 File Uploads with Cloudinary
🧑‍💼 Role-Based Access Control
📊 Dashboard Analytics
📱 Responsive SaaS UI
🌙 Modern Dark Theme
🛠️ Tech Stack
Frontend
React
TypeScript
Tailwind CSS
React Router DOM
Axios
React Hot Toast
Backend
Node.js
Express.js
Prisma ORM
MySQL
JWT Authentication
Socket.IO
Services
Cloudinary
Railway / Render
Vercel
📂 Project Structure
TeamSync/
│
├── client/      # React Frontend
│
├── server/      # Node.js Backend
│
└── README.md
⚙️ Environment Variables
Frontend (client/.env)
VITE_API_URL=http://localhost:5000
Backend (server/.env)
PORT=5000

DATABASE_URL=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

FRONTEND_URL=http://localhost:5173
🚀 Installation
1. Clone Repository
git clone <your_repo_url>
2. Install Frontend
cd client
npm install
3. Install Backend
cd server
npm install
🗄️ Prisma Setup
npx prisma generate
npx prisma migrate dev
▶️ Run Project
Frontend
cd client
npm run dev
Backend
cd server
npm run dev
🌐 Deployment
Frontend

Deploy using:

Vercel
Backend

Deploy using:

Railway
Render
Database
Railway MySQL
🔥 Live Features
Real-time task updates
Real-time comments
Online users indicator
Drag & Drop Kanban Board
Attachment upload & preview
AI-powered task analysis
📸 Screenshots

Add screenshots here after deployment.

👩‍💻 Author

Maheswari

React Developer
Full Stack Developer
Exploring AI & Scalable Web Applications
⭐ Future Improvements
Video meetings
Notifications
Email invites
Activity tracking
Advanced analytics
Mobile app
📄 License

This project is licensed under the MIT License.