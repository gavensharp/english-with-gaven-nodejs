"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import {
  getAllSlots,
  getAllLessons,
  createAvailabilitySlot,
  deleteAvailabilitySlot,
  AvailabilitySlot,
  Lesson,
} from "@/services/lessonService";

interface AdminCalendarProps {
  timezone: string;
}

export default function AdminCalendar({ timezone }: AdminCalendarProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    startTime: "",
    endTime: "",
    notes: "",
  });

  const calendarTimeZone = timezone || "UTC";

  useEffect(() => {
    fetchData();
  }, [calendarTimeZone]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in as admin");
        return;
      }

      // Fetch availability slots and all lessons
      const [slots, lessons] = await Promise.all([
        getAllSlots(token),
        getAllLessons(token),
      ]);

      const calendarEvents = [];

      // Add availability slots (green background)
      slots.forEach((slot) => {
        calendarEvents.push({
          id: `slot-${slot.id}`,
          title: `Available: ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
          start: slot.startTime,
          end: slot.endTime,
          backgroundColor: "#10b981",
          borderColor: "#059669",
          extendedProps: {
            type: "slot",
            slotData: slot,
          },
        });
      });

      // Add lessons as booked overlays (cancelled lessons are hidden)
      lessons
        .filter((lesson) => lesson.status !== "cancelled")
        .forEach((lesson) => {
          calendarEvents.push({
            id: `lesson-${lesson.id}`,
            title: `${lesson.student?.name || "Student"} - ${formatTime(lesson.startTime)}`,
            start: lesson.startTime,
            end: lesson.endTime,
            backgroundColor: "#FFB84D",
            borderColor: "#f59e0b",
            textColor: "#114F11",
            extendedProps: {
              type: "lesson",
              lessonData: lesson,
            },
          });
        });

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load calendar. Make sure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return formatInTimeZone(new Date(dateString), calendarTimeZone, "HH:mm");
  };

  const formatDateTime = (dateString: string) => {
    return formatInTimeZone(
      new Date(dateString),
      calendarTimeZone,
      "dd/MM/yyyy, HH:mm:ss",
    );
  };

  const handleDateClick = (info: any) => {
    // Set default times for new slot
    const dayString = formatInTimeZone(
      info.date,
      calendarTimeZone,
      "yyyy-MM-dd",
    );

    setNewSlot({
      startTime: `${dayString}T09:00`,
      endTime: `${dayString}T17:00`,
      notes: "",
    });
    setShowCreateModal(true);
  };

  const handleEventClick = (info: any) => {
    const eventType = info.event.extendedProps.type;

    if (eventType === "slot") {
      const slotData = info.event.extendedProps.slotData;
      setSelectedSlot(slotData);
      setShowSlotModal(true);
    } else if (eventType === "lesson") {
      const lessonData = info.event.extendedProps.lessonData;
      setSelectedLesson(lessonData);
      setShowLessonModal(true);
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in as admin");
      return;
    }

    try {
      await createAvailabilitySlot(
        {
          startTime: fromZonedTime(
            newSlot.startTime,
            calendarTimeZone,
          ).toISOString(),
          endTime: fromZonedTime(
            newSlot.endTime,
            calendarTimeZone,
          ).toISOString(),
          notes: newSlot.notes,
        },
        token,
      );
      alert("Availability slot created successfully!");
      setShowCreateModal(false);
      setNewSlot({ startTime: "", endTime: "", notes: "" });
      fetchData(); // Refresh calendar
    } catch (error: any) {
      alert(error.message || "Failed to create availability slot");
    }
  };

  const handleDeleteSlot = async () => {
    if (!selectedSlot) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    if (
      !confirm(
        "Are you sure you want to delete this availability slot? This will also cancel all booked lessons within this slot.",
      )
    ) {
      return;
    }

    try {
      await deleteAvailabilitySlot(selectedSlot.id, token);
      alert("Availability slot deleted successfully!");
      setShowSlotModal(false);
      fetchData(); // Refresh calendar
    } catch (error: any) {
      alert(error.message || "Failed to delete availability slot");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg">Loading admin calendar...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Admin Calendar - Manage Availability
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Create Availability Slot
        </button>
      </div>

      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: "#FFB84D" }}></div>
          <span>Booked</span>
        </div>
      </div>

      <FullCalendar
        key={calendarTimeZone}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          momentTimezonePlugin,
        ]}
        initialView="timeGridWeek"
        timeZone={calendarTimeZone}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        nowIndicator={true}
        editable={false}
      />

      {/* Create Availability Slot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Create Availability Slot</h3>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={newSlot.notes}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, notes: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                  placeholder="e.g., Available for 30min or 1hr lessons"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                  Create Slot
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Delete Availability Slot Modal */}
      {showSlotModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              Availability Slot Details
            </h3>

            <div className="space-y-2 mb-6">
              <p>
                <strong>Start:</strong> {formatDateTime(selectedSlot.startTime)}
              </p>
              <p>
                <strong>End:</strong> {formatDateTime(selectedSlot.endTime)}
              </p>
              <p>
                <strong>Booked Lessons:</strong>{" "}
                {selectedSlot.lessons?.length || 0}
              </p>
              {selectedSlot.notes && (
                <p>
                  <strong>Notes:</strong> {selectedSlot.notes}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteSlot}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
                Delete Slot
              </button>
              <button
                onClick={() => setShowSlotModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Lesson Modal */}
      {showLessonModal && selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Lesson Details</h3>

            <div className="space-y-2 mb-6">
              <p>
                <strong>Student:</strong> {selectedLesson.student?.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedLesson.student?.email}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {formatDateTime(selectedLesson.startTime)}
              </p>
              <p>
                <strong>End:</strong> {formatDateTime(selectedLesson.endTime)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{selectedLesson.status}</span>
              </p>
              {selectedLesson.notes && (
                <p>
                  <strong>Notes:</strong> {selectedLesson.notes}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowLessonModal(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
