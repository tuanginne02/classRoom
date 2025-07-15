"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container,
} from "@mui/material";
import {
  Group,
  Book,
  Message,
  TrendingUp,
  CheckCircle,
  Schedule,
  Person,
  Star,
  AccessTime,
  School,
  Assignment,
  Notifications,
} from "@mui/icons-material";
import api from "../../services/api";
import socket from "../../services/socket";

function OverviewTab({ students }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate real statistics from students data
  const onlineStudents = students.filter((s) => s.isOnline).length;
  const totalStudents = students.length;

  // Calculate lesson statistics
  let totalLessons = 0;
  let completedLessons = 0;
  let pendingLessons = 0;
  let averageProgress = 0;

  students.forEach((student) => {
    if (student.lessons) {
      totalLessons += student.lessons.length;
      student.lessons.forEach((lesson) => {
        if (lesson.completed) {
          completedLessons++;
        } else {
          pendingLessons++;
        }
      });
    }
  });

  // Calculate average progress
  if (totalLessons > 0) {
    averageProgress = Math.round((completedLessons / totalLessons) * 100);
  }

  // Fetch activities from API
  const fetchActivities = async () => {
    try {
      const response = await api.get("/activities?limit=10");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Listen for new activities
    socket.on("newActivity", (newActivity) => {
      setActivities((prevActivities) => [
        newActivity,
        ...prevActivities.slice(0, 9),
      ]);
    });

    return () => {
      socket.off("newActivity");
    };
  }, []);

  const getActivityColor = (type) => {
    switch (type) {
      case "lesson_completed":
        return "success";
      case "student_joined":
        return "primary";
      case "lesson_assigned":
        return "warning";
      case "lesson_updated":
        return "info";
      case "lesson_deleted":
        return "error";
      case "student_added":
        return "secondary";
      case "message":
        return "secondary";
      default:
        return "default";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "lesson_completed":
        return <CheckCircle />;
      case "student_joined":
        return <Person />;
      case "lesson_assigned":
        return <Assignment />;
      case "lesson_updated":
        return <Book />;
      case "lesson_deleted":
        return <Book />;
      case "student_added":
        return <Group />;
      case "message":
        return <Message />;
      default:
        return <Person />;
    }
  };

  const formatTimeAgo = (timeString) => {
    const now = new Date();
    const activityTime = new Date(timeString);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  // Get top performing students
  const topStudents = students
    .filter((student) => student.lessons && student.lessons.length > 0)
    .map((student) => {
      const completedCount = student.lessons.filter(
        (lesson) => lesson.completed
      ).length;
      const totalCount = student.lessons.length;
      const progress =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      return { ...student, progress, completedCount, totalCount };
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2} className="rounded-xl">
            <CardContent className="p-6">
              <Typography
                variant="h6"
                className="font-semibold mb-4 flex items-center"
              >
                <Notifications className="mr-2" />
                Recent Activities
              </Typography>
              <Divider className="mb-4" />
              {loading ? (
                <Box className="text-center py-8">
                  <Typography variant="body2" color="textSecondary">
                    Loading activities...
                  </Typography>
                </Box>
              ) : activities.length === 0 ? (
                <Box className="text-center py-8">
                  <Typography variant="body2" color="textSecondary">
                    No recent activities
                  </Typography>
                </Box>
              ) : (
                <List className="space-y-2">
                  {activities.map((activity, index) => (
                    <ListItem
                      key={index}
                      className="bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors"
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: `${getActivityColor(activity.type)}.main`,
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" className="font-medium">
                            {activity.message}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            className="flex items-center"
                          >
                            <AccessTime sx={{ fontSize: 12, mr: 0.5 }} />
                            {formatTimeAgo(activity.timestamp)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Students */}
        <Grid item xs={12} lg={4}>
          <Card elevation={2} className="rounded-xl">
            <CardContent className="p-6">
              <Typography
                variant="h6"
                className="font-semibold mb-4 flex items-center"
              >
                <Star className="mr-2" />
                Top Performers
              </Typography>
              <Divider className="mb-4" />
              {topStudents.length === 0 ? (
                <Box className="text-center py-8">
                  <School
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    No students with lessons yet
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {topStudents.map((student, index) => (
                    <Box
                      key={student.phone}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Box className="flex items-center space-x-3">
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor:
                              index === 0
                                ? "gold"
                                : index === 1
                                ? "silver"
                                : index === 2
                                ? "#cd7f32"
                                : "primary.main",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" className="font-medium">
                            {student.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {student.completedCount}/{student.totalCount}{" "}
                            lessons
                          </Typography>
                        </Box>
                      </Box>
                      <Box className="text-right">
                        <Typography
                          variant="h6"
                          className="font-bold text-green-600"
                        >
                          {student.progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={student.progress}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                          color="success"
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={2}
                className="rounded-xl hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 56, height: 56 }}
                    >
                      <Group />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        className="font-bold text-gray-800"
                      >
                        {onlineStudents}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Online Students
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        of {totalStudents} total
                      </Typography>
                    </Box>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={
                      totalStudents > 0
                        ? (onlineStudents / totalStudents) * 100
                        : 0
                    }
                    sx={{ mt: 2, height: 6, borderRadius: 3 }}
                    color="primary"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={2}
                className="rounded-xl hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ bgcolor: "success.main", width: 56, height: 56 }}
                    >
                      <Book />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        className="font-bold text-gray-800"
                      >
                        {totalLessons}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total Lessons
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip
                          label={`${completedLessons} done`}
                          size="small"
                          color="success"
                        />
                        <Chip
                          label={`${pendingLessons} pending`}
                          size="small"
                          color="warning"
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={2}
                className="rounded-xl hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ bgcolor: "warning.main", width: 56, height: 56 }}
                    >
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        className="font-bold text-gray-800"
                      >
                        {averageProgress}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Average Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={averageProgress}
                        sx={{ mt: 2, height: 6, borderRadius: 3 }}
                        color="success"
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={2}
                className="rounded-xl hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ bgcolor: "info.main", width: 56, height: 56 }}
                    >
                      <CheckCircle />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        className="font-bold text-gray-800"
                      >
                        {completedLessons}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Completed
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {totalLessons > 0
                          ? Math.round((completedLessons / totalLessons) * 100)
                          : 0}
                        % completion rate
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OverviewTab;
