import { Request, Response } from "express";
import { prisma } from "../utils/db";

// Get all users (admin only)
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "student", // Only show students, not other admins
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile_photo: true,
        dob: true,
        country: true,
        timezone: true,
        english_level: true,
        _count: {
          select: {
            bookedLessons: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    // Format the response
    const formattedUsers = users.map((user) => ({
      ...user,
      totalLessons: user._count.bookedLessons,
      _count: undefined,
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

// Get individual user details (admin only)
export async function getUserDetails(req: Request, res: Response) {
  try {
    const userId = parseInt(
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
    );

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile_photo: true,
        dob: true,
        gender: true,
        country: true,
        timezone: true,
        english_level: true,
        bookedLessons: {
          include: {
            availabilitySlot: {
              select: {
                startTime: true,
                endTime: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate lesson statistics
    const upcomingLessons = user.bookedLessons.filter(
      (lesson) =>
        lesson.status === "scheduled" &&
        new Date(lesson.startTime) > new Date(),
    );
    const completedLessons = user.bookedLessons.filter(
      (lesson) => lesson.status === "completed",
    );
    const cancelledLessons = user.bookedLessons.filter(
      (lesson) => lesson.status === "cancelled",
    );

    const userDetails = {
      ...user,
      lessons: user.bookedLessons,
      bookedLessons: undefined,
      stats: {
        totalLessons: user.bookedLessons.length,
        upcomingLessons: upcomingLessons.length,
        completedLessons: completedLessons.length,
        cancelledLessons: cancelledLessons.length,
      },
    };

    res.json({ user: userDetails });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
}
