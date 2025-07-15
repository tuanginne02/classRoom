import { io } from "socket.io-client"

const SOCKET_SERVER_URL = "http://localhost:3001" // Your Express backend URL

// Modify socket to accept auth options
const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false, // We'll manually connect when needed
  auth: {}, // Placeholder for auth data
})

export default socket
