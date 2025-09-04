import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import "./calendar.css";
import "../utils.ts";
import { daysInMonth, daysInPrevMonth, daysOfWeek, firstDayWeekday, months } from "../utils.ts";
import type { CalendarEvent } from "./calendar_params.tsx";
import { useNavigate } from "react-router-dom";

const CalendarWidget = (props: {
  events: CalendarEvent[];
  //onNewEvent: () => void;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}) => {
  const { events, selectedDate, onDateSelect } = props;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [internalSelectedDate, setInternalSelectedDate] = useState(new Date());

  const navigate = useNavigate();

  const effectiveSelectedDate = selectedDate ?? internalSelectedDate;
  const effectiveOnDateSelect = onDateSelect ?? setInternalSelectedDate;

  const appointments: CalendarEvent[] = events ?? [];

  const navigateMonth = (direction: any) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day: any) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: any) => {
    if (!effectiveSelectedDate) return false;
    return (
      day === effectiveSelectedDate.getDate() &&
      currentDate.getMonth() === effectiveSelectedDate.getMonth() &&
      currentDate.getFullYear() === effectiveSelectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: any, event: CalendarEvent | undefined) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    effectiveOnDateSelect(newSelectedDate);
    if (event) {
      event.onClick(event);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <button key={`prev-${day}`} className="calendar-day prev-month" disabled>
          {day}
        </button>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const event = appointments.find((event) => event.date === day);
      days.push(
        <button
          key={day}
          className={`calendar-day ${isToday(day) ? "today" : ""} ${isSelected(day) ? "selected" : ""} ${event ? "has-appointments" : ""}`}
          onClick={() => handleDateClick(day, event)}
        >
          <span className="day-number">{day}</span>
          {event && <span className="appointment-indicator">{event.bubbleMessage}</span>}
        </button>
      );
    }

    const totalCells = Math.ceil((firstDayWeekday + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDayWeekday + daysInMonth);

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <button key={`next-${day}`} className="calendar-day next-month" disabled>
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <div className="calendar-title">
          <h3>Calendar</h3>
          <button className="add-appointment-btn">
            <Plus size={16} onClick={() => navigate('/appointment')} />
          </button>
        </div>

        <div className="calendar-navigation">
          <button className="nav-button" onClick={() => navigateMonth(-1)}>
            <ChevronLeft size={16} />
          </button>

          <span className="current-month">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>

          <button className="nav-button" onClick={() => navigateMonth(1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-content">
        <div className="calendar-weekdays">
          {daysOfWeek.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">{renderCalendarDays()}</div>
      </div>

      <div className="calendar-footer">
        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-dot today-dot"></span>
            <span className="legend-text">Today</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot appointment-dot"></span>
            <span className="legend-text">Appointments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
