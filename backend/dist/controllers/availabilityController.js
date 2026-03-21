"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvailabilitySlot = exports.createAvailabilitySlot = exports.getAllSlots = exports.getAvailableSlots = void 0;
const db_1 = require("../utils/db");
// Get all availability slots (public - anyone can view)
const getAvailableSlots = async (req, res) => {
    try {
        const now = new Date();
        const slots = await db_1.prisma.availabilitySlot.findMany({
            where: {
                endTime: {
                    gte: now, // Only future slots
                },
            },
            include: {
                lessons: {
                    select: {
                        id: true,
                        startTime: true,
                        endTime: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                startTime: "asc",
            },
        });
        res.json(slots);
    }
    catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({ error: "Failed to fetch available slots" });
    }
};
exports.getAvailableSlots = getAvailableSlots;
// Get all slots (admin only)
const getAllSlots = async (req, res) => {
    try {
        const slots = await db_1.prisma.availabilitySlot.findMany({
            include: {
                lessons: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                startTime: "asc",
            },
        });
        res.json(slots);
    }
    catch (error) {
        console.error("Error fetching all slots:", error);
        res.status(500).json({ error: "Failed to fetch slots" });
    }
};
exports.getAllSlots = getAllSlots;
// Create availability slot (admin only)
const createAvailabilitySlot = async (req, res) => {
    try {
        const { startTime, endTime, notes } = req.body;
        if (!startTime || !endTime) {
            return res
                .status(400)
                .json({ error: "Start time and end time are required" });
        }
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            return res
                .status(400)
                .json({ error: "End time must be after start time" });
        }
        // Check for overlapping slots
        const overlapping = await db_1.prisma.availabilitySlot.findFirst({
            where: {
                OR: [
                    {
                        AND: [{ startTime: { lte: start } }, { endTime: { gt: start } }],
                    },
                    {
                        AND: [{ startTime: { lt: end } }, { endTime: { gte: end } }],
                    },
                    {
                        AND: [{ startTime: { gte: start } }, { endTime: { lte: end } }],
                    },
                ],
            },
        });
        if (overlapping) {
            return res
                .status(400)
                .json({
                error: "This time slot overlaps with an existing availability slot",
            });
        }
        const slot = await db_1.prisma.availabilitySlot.create({
            data: {
                startTime: start,
                endTime: end,
                notes,
            },
        });
        res.status(201).json({
            message: "Availability slot created successfully",
            slot,
        });
    }
    catch (error) {
        console.error("Error creating availability slot:", error);
        res.status(500).json({ error: "Failed to create availability slot" });
    }
};
exports.createAvailabilitySlot = createAvailabilitySlot;
// Delete availability slot (admin only)
const deleteAvailabilitySlot = async (req, res) => {
    try {
        const slotId = Array.isArray(req.params.slotId)
            ? req.params.slotId[0]
            : req.params.slotId;
        const slot = await db_1.prisma.availabilitySlot.findUnique({
            where: { id: parseInt(slotId) },
            include: {
                lessons: true,
            },
        });
        if (!slot) {
            return res.status(404).json({ error: "Availability slot not found" });
        }
        // Check if there are booked lessons
        if (slot.lessons.length > 0) {
            return res.status(400).json({
                error: "Cannot delete slot with booked lessons. Cancel all lessons first.",
            });
        }
        await db_1.prisma.availabilitySlot.delete({
            where: { id: parseInt(slotId) },
        });
        res.json({ message: "Availability slot deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting availability slot:", error);
        res.status(500).json({ error: "Failed to delete availability slot" });
    }
};
exports.deleteAvailabilitySlot = deleteAvailabilitySlot;
//# sourceMappingURL=availabilityController.js.map