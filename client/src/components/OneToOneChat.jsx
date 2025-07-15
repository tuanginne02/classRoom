"use client";

import { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import { useAuth } from "../hooks/useAuth";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SchoolIcon from "@mui/icons-material/School";

// Helper function to generate a consistent room ID for 1-1 chat in a classroom
const getRoomId = (classroomId, instructorPhone, studentPhone) => {
  return `room_${classroomId}_${instructorPhone}_${studentPhone}`;
};

function OneToOneChat({
  classroomId,
  instructorPhone,
  studentPhone,
  currentUserPhone,
  targetUserName,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { userType } = useAuth();

  // Generate roomId for this chat session
  const roomId = getRoomId(classroomId, instructorPhone, studentPhone);

  useEffect(() => {
    if (!socket.connected) {
      socket.auth = { phoneNumber: currentUserPhone, userType: userType };
      socket.connect();
    } else {
      socket.auth = { phoneNumber: currentUserPhone, userType: userType };
    }

    // Join the specific room for this chat
    socket.emit("join room", roomId);

    // Request messages for this room
    socket.emit("request room messages", roomId);

    socket.on("load room messages", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("room chat message", (msg) => {
      if (msg.roomId === roomId) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    return () => {
      socket.emit("leave room", roomId);
      socket.off("load room messages");
      socket.off("room chat message");
    };
  }, [roomId, currentUserPhone, userType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        sender: userType, // 'instructor' or 'student'
        phone: currentUserPhone,
        text: newMessage,
        roomId: roomId, // Include roomId
        timestamp: Date.now(),
      };
      socket.emit("room chat message", messageData);
      setNewMessage("");
    }
  };

  const getSenderAvatar = (senderType) => {
    if (senderType === "instructor") {
      return <SchoolIcon className="text-blue-500" />;
    } else if (senderType === "student") {
      return <AccountCircleIcon className="text-green-500" />;
    }
    return <AccountCircleIcon className="text-gray-500" />;
  };

  return (
    <Paper
      elevation={3}
      className="p-4 flex flex-col h-[500px] rounded-lg shadow-md bg-white"
    >
      <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
        Chat with {targetUserName || "User"}
      </Typography>
      <Box className="flex-1 overflow-y-auto mb-4 p-2 border border-gray-200 rounded-md bg-gray-50">
        {messages.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            className="mt-4"
          >
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              className={`flex mb-3 ${
                msg.phone === currentUserPhone ? "justify-end" : "justify-start"
              }`}
            >
              <Box
                className={`flex items-start max-w-[75%] ${
                  msg.phone === currentUserPhone ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="mx-2 mt-1">
                  {getSenderAvatar(msg.sender)}
                </Avatar>
                <Paper
                  variant="outlined"
                  className={`p-3 rounded-xl ${
                    msg.phone === currentUserPhone
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <Typography
                    variant="caption"
                    className="block text-xs opacity-80 mb-1"
                  >
                    {msg.phone === currentUserPhone
                      ? "You"
                      : `${msg.sender} (${msg.phone})`}
                  </Typography>
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography
                    variant="caption"
                    className="block text-right text-xs opacity-60 mt-1"
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          size="medium"
          className="bg-white"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          Send
        </Button>
      </form>
    </Paper>
  );
}

export default OneToOneChat;
