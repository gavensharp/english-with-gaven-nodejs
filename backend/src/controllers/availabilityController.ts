import { Request, Response } from "express";
import { prisma } from "../utils/db";

function isIsoDateTimeWithOffset(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[+-]\d{2}:\d{2})$/.test(
    value,
  );
}

// Get all availability slots (public - anyone can view)
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const slots = await prisma.availabilitySlot.findMany({
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
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
};

// Get all slots (admin only)
export const getAllSlots = async (req: Request, res: Response) => {
  try {
    const slots = await prisma.availabilitySlot.findMany({
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
  } catch (error) {
    console.error("Error fetching all slots:", error);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
};

// Create availability slot (admin only)
export const createAvailabilitySlot = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime, notes } = req.body;

    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "Start time and end time are required" });
    }

    if (
      !isIsoDateTimeWithOffset(startTime) ||
      !isIsoDateTimeWithOffset(endTime)
    ) {
      return res.status(400).json({
        error:
          "Start time and end time must be ISO 8601 with timezone offset (example: 2026-05-01T08:00:00.000Z)",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "End time must be after start time" });
    }

    // Check for overlapping slots
    const overlapping = await prisma.availabilitySlot.findFirst({
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
      return res.status(400).json({
        error: "This time slot overlaps with an existing availability slot",
      });
    }

    const slot = await prisma.availabilitySlot.create({
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
  } catch (error) {
    console.error("Error creating availability slot:", error);
    res.status(500).json({ error: "Failed to create availability slot" });
  }
};

// Delete availability slot (admin only)
export const deleteAvailabilitySlot = async (req: Request, res: Response) => {
  try {
    const slotId = Array.isArray(req.params.slotId)
      ? req.params.slotId[0]
      : req.params.slotId;

    const slot = await prisma.availabilitySlot.findUnique({
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
        error:
          "Cannot delete slot with booked lessons. Cancel all lessons first.",
      });
    }

    await prisma.availabilitySlot.delete({
      where: { id: parseInt(slotId) },
    });

    res.json({ message: "Availability slot deleted successfully" });
  } catch (error) {
    console.error("Error deleting availability slot:", error);
    res.status(500).json({ error: "Failed to delete availability slot" });
  }
};
