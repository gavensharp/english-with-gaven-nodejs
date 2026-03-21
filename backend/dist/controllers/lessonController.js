"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLessons = exports.cancelLesson = exports.bookLesson = exports.getMyLessons = void 0;
const db_1 = require("../utils/db");
// Get student's booked lessons
const getMyLessons = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const lessons = await db_1.prisma.lesson.findMany({
            where: {
                studentId: userId,
            },
            include: {
                availabilitySlot: true,
            },
            orderBy: {
                startTime: "asc",
            },
        });
        res.json(lessons);
    }
    catch (error) {
        console.error("Error fetching my lessons:", error);
        res.status(500).json({ error: "Failed to fetch your lessons" });
    }
};
exports.getMyLessons = getMyLessons;
// Book a lesson (student) - student selects time within availability slot
// Book a lesson (student) - student selects time within availability slot
const bookLesson = async (req, res) => {
    try {
        const { slotId, startTime, endTime } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!slotId || !startTime || !endTime) {
            return res
                .status(400)
                .json({ error: "Slot ID, start time, and end time are required" });
        }
        const start = new Date(startTime);
        const end = new Date(endTime);
        // ADD DEBUG LOGGING:
        console.log("=== BOOKING REQUEST ===");
        console.log("Slot ID:", slotId);
        console.log("Received startTime:", startTime);
        console.log("Received endTime:", endTime);
        console.log("Parsed start:", start.toISOString());
        console.log("Parsed end:", end.toISOString());
        // Validate duration (30min or 60min)
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        console.log("Duration in minutes:", durationMinutes);
        if (durationMinutes !== 30 && durationMinutes !== 60) {
            return res.status(400).json({ error: "Lesson must be 30 or 60 minutes" });
        }
        // Check if availability slot exists
        const availabilitySlot = await db_1.prisma.availabilitySlot.findUnique({
            where: { id: parseInt(slotId) },
            include: {
                lessons: true,
            },
        });
        if (!availabilitySlot) {
            return res.status(404).json({ error: "Availability slot not found" });
        }
        console.log("=== AVAILABILITY SLOT ===");
        console.log("Slot startTime:", availabilitySlot.startTime.toISOString());
        console.log("Slot endTime:", availabilitySlot.endTime.toISOString());
        // Check if requested time is within the availability slot
        if (start < availabilitySlot.startTime || end > availabilitySlot.endTime) {
            console.log("=== VALIDATION FAILED ===");
            console.log("start < slot.start:", start < availabilitySlot.startTime);
            console.log("end > slot.end:", end > availabilitySlot.endTime);
            return res
                .status(400)
                .json({ error: "Requested time is outside the availability slot" });
        }
        // Check for overlapping lessons in this slot
        const overlapping = availabilitySlot.lessons.find((lesson) => {
            return ((start >= lesson.startTime && start < lesson.endTime) ||
                (end > lesson.startTime && end <= lesson.endTime) ||
                (start <= lesson.startTime && end >= lesson.endTime));
        });
        if (overlapping) {
            return res.status(400).json({ error: "This time is already booked" });
        }
        // Create the lesson
        const lesson = await db_1.prisma.lesson.create({
            data: {
                title: "English Lesson",
                startTime: start,
                endTime: end,
                status: "booked",
                studentId: userId,
                availabilitySlotId: parseInt(slotId),
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                availabilitySlot: true,
            },
        });
        res.status(201).json({
            message: "Lesson booked successfully",
            lesson,
        });
    }
    catch (error) {
        console.error("Error booking lesson:", error);
        res.status(500).json({ error: "Failed to book lesson" });
    }
};
exports.bookLesson = bookLesson;
// Cancel a lesson (student)
const cancelLesson = async (req, res) => {
    try {
        const lessonId = Array.isArray(req.params.lessonId)
            ? req.params.lessonId[0]
            : req.params.lessonId;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Check if lesson belongs to the user
        const lesson = await db_1.prisma.lesson.findUnique({
            where: { id: parseInt(lessonId) },
        });
        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found" });
        }
        if (lesson.studentId !== userId) {
            return res
                .status(403)
                .json({ error: "Not authorized to cancel this lesson" });
        }
        // Cancellation policy: allow cancellation only when the lesson is more than 1 hour away.
        const hoursUntilLesson = (lesson.startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
        if (hoursUntilLesson < 1) {
            return res.status(400).json({
                error: "Cancellation is not allowed within 1 hour of the scheduled time. If cancelled within 1 hour or after the lesson has started, the full lesson amount is charged.",
            });
        }
        // Delete the lesson (free up the time slot)
        await db_1.prisma.lesson.delete({
            where: { id: parseInt(lessonId) },
        });
        res.json({
            message: "Lesson cancelled successfully. For timely processing, please inform Gaven by email at least 2 hours in advance.",
        });
    }
    catch (error) {
        console.error("Error cancelling lesson:", error);
        res.status(500).json({ error: "Failed to cancel lesson" });
    }
};
exports.cancelLesson = cancelLesson;
// Get all lessons (admin only)
const getAllLessons = async (req, res) => {
    try {
        const lessons = await db_1.prisma.lesson.findMany({
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                availabilitySlot: true,
            },
            orderBy: {
                startTime: "asc",
            },
        });
        res.json(lessons);
    }
    catch (error) {
        console.error("Error fetching all lessons:", error);
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
};
exports.getAllLessons = getAllLessons;
//# sourceMappingURL=lessonController.js.map