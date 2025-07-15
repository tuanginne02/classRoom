"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import { Typography, Box, Paper, List, ListItem, ListItemText, Button, Snackbar, Alert } from "@mui/material"

function StudentProfilePage() {
  const { phone } = useParams() // Get phone from URL params
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await api.get(`/student/${phone}`)
        setStudent(response.data)
      } catch (error) {
        console.error("Error fetching student profile:", error)
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to fetch student profile.",
          severity: "error",
        })
        setStudent(null) // Clear student data if not found
      }
    }

    if (phone) {
      fetchStudentProfile()
    }
  }, [phone])

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (!student) {
    return (
      <Box className="flex items-center justify-center min-h-screen bg-gray-100">
        <Typography variant="h6">Loading student profile or student not found...</Typography>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    )
  }

  return (
    <Box className="p-8 bg-gray-50 min-h-screen">
      <Button variant="outlined" onClick={() => navigate("/instructor-dashboard")} className="mb-4">
        Back to Dashboard
      </Button>
      <Paper elevation={3} className="p-8 rounded-lg shadow-md">
        <Typography variant="h4" gutterBottom>
          Student Profile: {student.name}
        </Typography>
        <Typography variant="h6">Phone: {student.phone}</Typography>
        <Typography variant="h6" className="mb-6">
          Email: {student.email}
        </Typography>

        <Typography variant="h5" gutterBottom>
          Assigned Lessons
        </Typography>
        {student.lessons.length === 0 ? (
          <Typography>No lessons assigned to this student yet.</Typography>
        ) : (
          <List>
            {student.lessons.map((lesson) => (
              <ListItem key={lesson.id}>
                <ListItemText
                  primary={lesson.title}
                  secondary={lesson.description}
                  className={lesson.completed ? "line-through text-gray-500" : ""}
                />
                <Typography variant="body2" color={lesson.completed ? "success.main" : "text.secondary"}>
                  {lesson.completed ? "Completed" : "Pending"}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default StudentProfilePage
