const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (backendUrl ? `${backendUrl}/api` : "/api");

export interface AvailabilitySlot {
  id: number;
  startTime: string;
  endTime: string;
  notes?: string;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  status: "booked" | "completed" | "cancelled";
  notes?: string;
  studentId: number;
  availabilitySlotId?: number;
  student?: {
    id: number;
    name: string;
    email: string;
  };
  availabilitySlot?: AvailabilitySlot;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AVAILABILITY SLOT ENDPOINTS (Public/Admin)
// ============================================

// Get all available slots (public)
export async function getAvailableSlots(): Promise<AvailabilitySlot[]> {
  const response = await fetch(`${API_URL}/availability/available`);

  if (!response.ok) {
    throw new Error("Failed to fetch available slots");
  }

  return response.json();
}

// Get all slots - admin only (requires auth)
export async function getAllSlots(token: string): Promise<AvailabilitySlot[]> {
  const response = await fetch(`${API_URL}/availability/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch all slots");
  }

  return response.json();
}

// Create availability slot - admin only (requires auth)
export async function createAvailabilitySlot(
  slotData: {
    startTime: string;
    endTime: string;
    notes?: string;
  },
  token: string,
): Promise<{ message: string; slot: AvailabilitySlot }> {
  const response = await fetch(`${API_URL}/availability/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(slotData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create availability slot");
  }

  return response.json();
}

// Delete availability slot - admin only (requires auth)
export async function deleteAvailabilitySlot(
  slotId: number,
  token: string,
): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/availability/delete/${slotId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete availability slot");
  }

  return response.json();
}

// ============================================
// LESSON ENDPOINTS (Student/Admin)
// ============================================

// Get user's booked lessons (requires auth)
export async function getMyLessons(token: string): Promise<Lesson[]> {
  const response = await fetch(`${API_URL}/lessons/my-lessons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch your lessons");
  }

  return response.json();
}

// Book a lesson within an availability slot (requires auth)
export async function bookLesson(
  bookingData: {
    slotId: number;
    startTime: string;
    endTime: string;
  },
  token: string,
): Promise<{ message: string; lesson: Lesson }> {
  const response = await fetch(`${API_URL}/lessons/book`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to book lesson");
  }

  return response.json();
}

// Cancel a lesson (requires auth)
export async function cancelLesson(
  lessonId: number,
  token: string,
): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/lessons/cancel/${lessonId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to cancel lesson");
  }

  return response.json();
}

// Get all lessons - admin only (requires auth)
export async function getAllLessons(token: string): Promise<Lesson[]> {
  const response = await fetch(`${API_URL}/lessons/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch all lessons");
  }

  return response.json();
}
