"use client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfilePage from "./pages/StudentProfilePage";
import SetupAccountPage from "./pages/SetupAccountPage"; // Import new page
import AdminDashboard from "./pages/AdminDashboard"; // Import admin dashboard
import ChooseRolePage from "./pages/ChooseRolePage";
import InstructorInfoPage from "./pages/InstructorInfoPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Define a simple Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    ); // Or a proper spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />; // Redirect to an unauthorized page
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/setup-account/:token"
              element={<SetupAccountPage />}
            />{" "}
            {/* New route */}
            <Route path="/choose-role" element={<ChooseRolePage />} />
            <Route path="/instructor-info" element={<InstructorInfoPage />} />
            <Route
              path="/instructor-dashboard"
              element={
                <PrivateRoute allowedRoles={["instructor"]}>
                  <InstructorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-profile/:phone"
              element={
                <PrivateRoute allowedRoles={["instructor"]}>
                  <StudentProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            {/* Add a route for unauthorized access */}
            <Route
              path="/unauthorized"
              element={
                <div className="text-center mt-20 text-red-500 text-xl">
                  You are not authorized to view this page.
                </div>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />{" "}
            {/* Catch-all for undefined routes */}
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
