import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { getAppointmentsByRange } from "../services/clinicService";

const locales = { "en-US": undefined };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Confirmed: "#3b82f6",
  Completed: "#10b981",
  Cancelled: "#ef4444",
  "No Show": "#6b7280",
};

function eventStyleGetter(event) {
  const color = STATUS_COLORS[event.resource?.status] || "#3b82f6";
  return {
    style: {
      backgroundColor: color,
      borderRadius: "6px",
      border: "none",
      color: "#fff",
      fontSize: "0.75rem",
      padding: "2px 6px",
    },
  };
}

const calendarFormats = {
  timeGutterFormat: "h:mm a",
  eventTimeRangeFormat: ({ start }, culture, localizer) =>
    localizer.format(start, "h:mm a"),
  agendaTimeFormat: "h:mm a",
  agendaTimeRangeFormat: ({ start }, culture, localizer) =>
    localizer.format(start, "h:mm a"),
  dayFormat: (date, culture, localizer) => localizer.format(date, "EEE d"),
  dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
    `${localizer.format(start, "MMM d")} – ${localizer.format(end, "MMM d, yyyy")}`,
};

function ClinicCalendar({ onDateSelect, onAppointmentSelect }) {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const loadRange = async (date) => {
    try {
      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
      ).toISOString();
      const end = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
      ).toISOString();
      const data = await getAppointmentsByRange(start, end);
      setEvents(
        data.map((a) => ({
          id: a._id,
          title: `${a.patient?.name || "Patient"} – ${a.service}`,
          start: new Date(`${a.date.slice(0, 10)}T${a.time || "00:00"}:00`),
          end: new Date(`${a.date.slice(0, 10)}T${a.time || "00:00"}:00`),
          resource: a,
        })),
      );
    } catch (err) {
      console.error("Calendar load error", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRange(currentDate);
  }, [currentDate]);

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const handleSelectSlot = ({ start }) => {
    const dateStr = format(start, "yyyy-MM-dd");
    onDateSelect(dateStr);
  };

  const handleSelectEvent = (event) => {
    if (onAppointmentSelect) onAppointmentSelect(event.resource);
    else onDateSelect(format(new Date(event.start), "yyyy-MM-dd"));
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onNavigate={handleNavigate}
        date={currentDate}
        eventPropGetter={eventStyleGetter}
        style={{ height: "600px" }}
        views={["month", "week", "day"]}
        defaultView="month"
        formats={calendarFormats}
        popup
      />
    </div>
  );
}

export default ClinicCalendar;
