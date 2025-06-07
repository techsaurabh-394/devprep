import React, { useState, useMemo } from "react";
import { PlusCircle, Edit2, Trash2, X, Check } from "lucide-react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";

// Set up the localizer for date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS }, // English locale
});

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventText, setNewEventText] = useState("");
  const [newEventDate, setNewEventDate] = useState(new Date());

  // Add a new event
  const handleAddEvent = () => {
    if (newEventText.trim() && newEventDate) {
      const newEvent = {
        id: Date.now(),
        text: newEventText,
        start: newEventDate,
        end: new Date(newEventDate.getTime() + 60 * 60 * 1000), // 1 hour duration
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setShowAddModal(false);
      setNewEventText("");
    }
  };

  // Edit an event
  const handleEditEvent = (eventId) => {
    if (editText.trim()) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, text: editText } : event
        )
      );
      setEditEventId(null);
    }
  };

  // Delete an event
  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };

  // Date change handler
  const handleDateChange = (newDate) => {
    setDate(newDate);
    setEditEventId(null);
  };

  // Map events to Big Calendar format
  const eventList = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        start: new Date(event.start), // Ensure it's a Date object
        end: new Date(event.end), // Ensure it's a Date object
      })),
    [events]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Calendar & Events
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <BigCalendar
              localizer={localizer}
              events={eventList}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={(event) => {
                setEditEventId(event.id);
                setEditText(event.text);
              }}
              onSelectSlot={({ start }) => {
                setDate(start);
                setNewEventDate(start); // Set the date for new event
                setShowAddModal(true);
              }}
              selectable
              style={{ height: 600 }}
            />
          </div>

          {/* Events Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <PlusCircle size={18} />
                <span>Add Event</span>
              </button>
            </div>

            <div className="space-y-4">
              {events
                .filter((event) => format(new Date(event.start), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
                .map((event) => (
                  <div key={event.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {editEventId === event.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                          rows="3"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditEventId(null)}
                            className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                          >
                            <X size={16} />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditEvent(event.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                          >
                            <Check size={16} />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <p className="text-gray-700">{event.text}</p>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditEventId(event.id);
                              setEditText(event.text);
                            }}
                            className="text-gray-600 hover:text-indigo-600 p-1 rounded transition-colors duration-200"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-gray-600 hover:text-red-600 p-1 rounded transition-colors duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Event</h3>
            <textarea
              value={newEventText}
              onChange={(e) => setNewEventText(e.target.value)}
              placeholder="Enter event details..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4 resize-none"
              rows="4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewEventText("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
