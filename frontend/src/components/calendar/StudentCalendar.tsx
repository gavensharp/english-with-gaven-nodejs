"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  getAvailableSlots,
  bookLesson,
  getMyLessons,
  AvailabilitySlot,
  Lesson,
} from "@/services/lessonService";
import { getToken } from "@/lib/auth";

export default function StudentCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    duration: 30, // 30 or 60 minutes
    startTime: "",
  });

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);

      // Fetch available slots
      const slots = await getAvailableSlots();

      // Fetch user's booked lessons if logged in
      const token = getToken();
      let myLessons: Lesson[] = [];
      if (token) {
        try {
          myLessons = await getMyLessons(token);
        } catch (err) {
          console.error("Error fetching my lessons:", err);
        }
      }

      // Format available slots for FullCalendar
      const formattedSlots = slots.map((slot) => {
        // Calculate how much time is still available
        const bookedMinutes = slot.lessons.reduce((total, lesson) => {
          const duration =
            (new Date(lesson.endTime).getTime() -
              new Date(lesson.startTime).getTime()) /
            (1000 * 60);
          return total + duration;
        }, 0);

        const totalMinutes =
          (new Date(slot.endTime).getTime() -
            new Date(slot.startTime).getTime()) /
          (1000 * 60);
        const availableMinutes = totalMinutes - bookedMinutes;

        return {
          id: slot.id.toString(),
          title: `Available (${availableMinutes}min free)`,
          start: slot.startTime,
          end: slot.endTime,
          backgroundColor: availableMinutes >= 30 ? "#10b981" : "#fbbf24", // green if 30+ min available, yellow otherwise
          borderColor: availableMinutes >= 30 ? "#059669" : "#f59e0b",
          extendedProps: {
            type: "available",
            slotData: slot,
            availableMinutes,
          },
        };
      });

      // Format booked lessons for FullCalendar
      const formattedLessons = myLessons
        .filter((lesson) => lesson.status !== "cancelled")
        .map((lesson) => ({
          id: `lesson-${lesson.id}`,
          title: lesson.title || "Your Lesson",
          start: lesson.startTime,
          end: lesson.endTime,
          backgroundColor: "#3b82f6", // blue for booked lessons
          borderColor: "#2563eb",
          textColor: "#ffffff",
          extendedProps: {
            type: "booked",
            lessonData: lesson,
          },
        }));

      // Combine both available slots and booked lessons
      setEvents([...formattedSlots, ...formattedLessons]);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info: any) => {
    const eventType = info.event.extendedProps.type;

    // If it's a booked lesson, show details
    if (eventType === "booked") {
      const lessonData = info.event.extendedProps.lessonData;
      alert(
        `Your Booked Lesson:\n\n` +
          `Title: ${lessonData.title || "English Lesson"}\n` +
          `Date: ${new Date(lessonData.startTime).toLocaleDateString()}\n` +
          `Time: ${new Date(lessonData.startTime).toLocaleTimeString()} - ${new Date(lessonData.endTime).toLocaleTimeString()}\n` +
          `Status: ${lessonData.status}\n\n` +
          `Go to your dashboard to manage this lesson.`,
      );
      return;
    }

    // Handle available slot booking
    const slotData = info.event.extendedProps.slotData;
    const availableMinutes = info.event.extendedProps.availableMinutes;

    if (availableMinutes < 30) {
      alert(
        "This slot does not have enough time available. Please choose another slot.",
      );
      return;
    }

    setSelectedSlot(slotData);

    // Set default start time to slot start
    const slotStart = new Date(slotData.startTime);
    setBookingData({
      duration: 30,
      startTime: slotStart.toISOString().slice(0, 16),
    });

    setShowBookingModal(true);
  };

  const getAvailableTimeSlots = () => {
    if (!selectedSlot) return [];

    const slotStart = new Date(selectedSlot.startTime);
    const slotEnd = new Date(selectedSlot.endTime);
    const bookedLessons = selectedSlot.lessons || [];

    const timeSlots: { start: Date; end: Date; label: string }[] = [];

    // Generate 30-minute intervals
    let currentTime = new Date(slotStart);

    while (currentTime < slotEnd) {
      const slotEndTime = new Date(
        currentTime.getTime() + bookingData.duration * 60000,
      );

      if (slotEndTime > slotEnd) break;

      // Check if this time slot overlaps with any booked lesson
      const isAvailable = !bookedLessons.some((lesson) => {
        const lessonStart = new Date(lesson.startTime);
        const lessonEnd = new Date(lesson.endTime);

        return (
          (currentTime >= lessonStart && currentTime < lessonEnd) ||
          (slotEndTime > lessonStart && slotEndTime <= lessonEnd) ||
          (currentTime <= lessonStart && slotEndTime >= lessonEnd)
        );
      });

      if (isAvailable) {
        timeSlots.push({
          start: new Date(currentTime),
          end: slotEndTime,
          label: `${currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${slotEndTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
        });
      }

      currentTime = new Date(currentTime.getTime() + 30 * 60000); // Move by 30 minutes
    }

    return timeSlots;
  };

  const handleBookLesson = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to book a lesson");
      window.location.href = "/login";
      return;
    }

    if (!selectedSlot || !bookingData.startTime) {
      alert("Please select a time slot");
      return;
    }

    try {
      // const startTime = new Date(bookingData.startTime);
      // const endTime = new Date(
      //   startTime.getTime() + bookingData.duration * 60000,
      // );
      // FIX: Append 'Z' to force UTC interpretation OR use the actual slot's timezone
      const startTime = new Date(bookingData.startTime + ":00.000Z");
      const endTime = new Date(
        startTime.getTime() + bookingData.duration * 60000,
      );

      console.log("=== FRONTEND BOOKING DATA ===");
      console.log("Selected Slot ID:", selectedSlot.id);
      console.log("Selected Slot startTime:", selectedSlot.startTime);
      console.log("Selected Slot endTime:", selectedSlot.endTime);
      console.log("User selected startTime:", bookingData.startTime);
      console.log("Calculated startTime object:", startTime);
      console.log("Calculated endTime object:", endTime);
      console.log("startTime ISO string:", startTime.toISOString());
      console.log("endTime ISO string:", endTime.toISOString());
      console.log("Duration (minutes):", bookingData.duration);

      await bookLesson(
        {
          slotId: selectedSlot.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
        token,
      );

      alert(
        "Lesson booked successfully! Check your dashboard to view your booking.",
      );
      setShowBookingModal(false);
      fetchCalendarData(); // Refresh calendar
    } catch (error: any) {
      alert(error.message || "Failed to book lesson");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg">Loading available lessons...</div>
      </div>
    );
  }

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Book a Lesson</h2>
        <p className="text-gray-600">
          Click on an available time slot to book your lesson (30 or 60
          minutes). Availability based on Jakarta time zone.
        </p>
      </div>

      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Available (30+ min)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Limited availability</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Your booked lessons</span>
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        nowIndicator={true}
        editable={false}
      />

      {/* Booking Modal */}
      {showBookingModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Book Your Lesson</h3>

            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Available Slot:</p>
              <p className="font-semibold">
                {new Date(selectedSlot.startTime).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-700">
                {new Date(selectedSlot.startTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(selectedSlot.endTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <form onSubmit={handleBookLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lesson Duration
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setBookingData({ ...bookingData, duration: 30 })
                    }
                    className={`py-3 px-4 rounded border-2 transition ${
                      bookingData.duration === 30
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                        : "border-gray-300 hover:border-gray-400"
                    }`}>
                    30 Minutes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBookingData({ ...bookingData, duration: 60 })
                    }
                    className={`py-3 px-4 rounded border-2 transition ${
                      bookingData.duration === 60
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                        : "border-gray-300 hover:border-gray-400"
                    }`}>
                    60 Minutes
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Start Time
                </label>
                {availableTimeSlots.length === 0 ? (
                  <p className="text-red-600 text-sm">
                    No available time slots for {bookingData.duration} minutes
                    in this block. Try selecting a different duration or slot.
                  </p>
                ) : (
                  <select
                    value={bookingData.startTime}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required>
                    <option value="">-- Select Time --</option>
                    {availableTimeSlots.map((slot, index) => (
                      <option
                        key={index}
                        value={slot.start.toISOString().slice(0, 16)}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={availableTimeSlots.length === 0}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                  Book Lesson
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
