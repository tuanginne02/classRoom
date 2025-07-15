// Mock user database - in production this would be a real database
import { mockUsers } from "../data/mockUser";
  export class UserService {
    static async getUserByPhone(phone) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
  
      // Check if user exists in mock database
      const user = mockUsers[phone]
      if (user) {
        return user
      }
  
      // If user doesn't exist, create a new student account
      const newUser = {
        id: `user_${Date.now()}`,
        name: `Người dùng ${phone.slice(-4)}`,
        phone,
        email: `user${phone.slice(-4)}@example.com`,
        role: "student", // Default role
        isOnline: true,
        studentId: `SV${Date.now().toString().slice(-6)}`,
        enrolledCourses: [],
      }
  
      // Save to mock database
      mockUsers[phone] = newUser
  
      return newUser
    }
  
    static async updateUserRole(userId, role) {
      // Find user by ID and update role
      const user = Object.values(mockUsers).find((u) => u.id === userId)
      if (user) {
        user.role = role
        if (role === "instructor") {
          user.instructorId = `GV${Date.now().toString().slice(-6)}`
          user.teachingCourses = []
          delete user.studentId
          delete user.enrolledCourses
        } else {
          user.studentId = `SV${Date.now().toString().slice(-6)}`
          user.enrolledCourses = []
          delete user.instructorId
          delete user.teachingCourses
        }
        return true
      }
      return false
    }
  }
  
  export const userService = UserService
  