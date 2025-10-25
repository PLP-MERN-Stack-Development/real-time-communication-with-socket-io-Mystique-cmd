# 🔄 Real-Time Chat Application with Socket.io

## 📖 Project Overview
This project is a **real-time chat application** built with **Node.js, Express, and Socket.io** on the backend and **React + Vite** on the frontend.  
It demonstrates **bidirectional communication** between clients and server, enabling features like live messaging, typing indicators, online/offline status, private chats, and notifications.  

The goal is to showcase how Socket.io can be used to build scalable, responsive, and user-friendly real-time applications.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js v18+  
- npm (comes with Node)  
- Git  

### 2. Clone the repository
```bash
git clone <your-repo-url>
cd real-time-communication-with-socket-io
```

### 3.Install Dependencies
## server
```
cd server
npm init -y
npm install express socket.io cors
npm install --save-dev nodemon
```

### client
```
cd ../client
npm create vite@latest .   # choose React
npm install
npm install socket.io-client
```

### 4. Run the development servers
## Start backend (port 3001)
```
cd server
npm run dev
```
## Start frontend (port 5173)
```
cd client
npm run dev
```
### 5. Access the app
Open your browser at: 👉 http://localhost:5173

### ✨ Features Implemented
## ✅ Core Features
User login with simple username

Global chat room for all users

Real-time messaging with sender name + timestamp

Typing indicators

Online/offline presence tracking

### 🚀 Advanced Features
Private messaging (DMs)

Multiple chat rooms/channels

Read receipts

File/image sharing (via upload + message link)

Message reactions (like, love, etc.)

🔔 Notifications
New message alerts

Join/leave room notifications

Unread message counts

Sound + browser notifications

### ⚡ Performance & UX
Reconnection logic for disconnections

Message delivery acknowledgments

Pagination for older messages

Search functionality

Responsive design (desktop + mobile)
