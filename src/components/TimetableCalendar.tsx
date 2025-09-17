import { useState, useMemo } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimetableEvent {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  room: string;
  startTime: string;
  endTime: string;
  date: Date;
  color: "math" | "science" | "english" | "history" | "art" | "pe";
}

interface TimetableCalendarProps {
  view: "week" | "month";
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  currentView: "student" | "faculty" | "admin";
}

const TimetableCalendar = ({ view, selectedDate, onDateSelect, currentView }: TimetableCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  // Sample timetable data
  const sampleEvents: TimetableEvent[] = [
    {
      id: "1",
      title: "Advanced Calculus",
      subject: "Mathematics",
      instructor: "Dr. Smith",
      room: "Room 101",
      startTime: "09:00",
      endTime: "10:30",
      date: new Date(2024, 0, 15),
      color: "math"
    },
    {
      id: "2",
      title: "Quantum Physics",
      subject: "Physics",
      instructor: "Prof. Johnson",
      room: "Lab 205",
      startTime: "11:00",
      endTime: "12:30",
      date: new Date(2024, 0, 15),
      color: "science"
    },
    {
      id: "3",
      title: "Shakespeare Studies",
      subject: "English Literature",
      instructor: "Ms. Davis",
      room: "Room 304",
      startTime: "14:00",
      endTime: "15:30",
      date: new Date(2024, 0, 15),
      color: "english"
    },
    {
      id: "4",
      title: "World War II",
      subject: "History",
      instructor: "Mr. Wilson",
      room: "Room 201",
      startTime: "10:00",
      endTime: "11:30",
      date: new Date(2024, 0, 16),
      color: "history"
    },
    {
      id: "5",
      title: "Abstract Painting",
      subject: "Art",
      instructor: "Ms. Taylor",
      room: "Art Studio",
      startTime: "13:00",
      endTime: "15:00",
      date: new Date(2024, 0, 17),
      color: "art"
    },
    {
      id: "6",
      title: "Team Sports",
      subject: "Physical Education",
      instructor: "Coach Brown",
      room: "Gymnasium",
      startTime: "08:00",
      endTime: "09:30",
      date: new Date(2024, 0, 18),
      color: "pe"
    }
  ];

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    return sampleEvents.filter(event => isSameDay(event.date, date));
  };

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const WeekView = () => (
    <div className="h-full">
      {/* Week Header */}
      <div className="grid grid-cols-8 gap-px bg-border rounded-t-lg overflow-hidden">
        <div className="bg-muted p-4">
          <span className="text-sm font-medium text-muted-foreground">Time</span>
        </div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="bg-card p-4 text-center">
            <div className="text-sm font-medium">{format(day, "EEE")}</div>
            <div className={cn(
              "text-lg font-semibold mt-1",
              isSameDay(day, new Date()) && "text-primary"
            )}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-8 gap-px bg-border rounded-b-lg overflow-hidden">
        {timeSlots.map((timeSlot) => (
          <div key={timeSlot} className="contents">
            <div className="bg-muted p-4 border-r border-border">
              <span className="text-sm font-medium text-muted-foreground">{timeSlot}</span>
            </div>
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day).filter(event => 
                event.startTime === timeSlot
              );
              
              return (
                <div key={`${day.toISOString()}-${timeSlot}`} className="bg-card p-2 min-h-[80px] relative">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-2 rounded-lg text-xs cursor-pointer transition-smooth hover:scale-105",
                        `subject-${event.color}`
                      )}
                      onClick={() => onDateSelect(day)}
                    >
                      <div className="font-semibold truncate">{event.title}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.startTime}-{event.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const MonthView = () => (
    <div className="p-4">
      {/* Month Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-3 text-center">
            <span className="text-sm font-semibold text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Fill empty days at the start */}
        {Array.from({ length: startOfWeek(startOfMonth(currentDate)).getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        
        {monthDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "aspect-square p-2 rounded-lg border cursor-pointer transition-smooth hover:bg-muted/50",
                isCurrentMonth ? "border-border" : "border-transparent",
                isToday && "border-primary bg-primary/10",
                isSelected && "bg-accent/20 border-accent",
                !isCurrentMonth && "text-muted-foreground"
              )}
              onClick={() => onDateSelect(day)}
            >
              <div className="h-full flex flex-col">
                <span className={cn(
                  "text-sm font-medium",
                  isToday && "text-primary font-bold"
                )}>
                  {format(day, "d")}
                </span>
                <div className="flex-1 mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "w-full h-1.5 rounded-full",
                        `bg-subject-${event.color}`
                      )}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-xl font-semibold">
            {format(currentDate, view === "month" ? "MMMM yyyy" : "MMMM yyyy")}
          </h3>
          {view === "week" && (
            <p className="text-sm text-muted-foreground mt-1">
              {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentDate(new Date())}
            className="px-4"
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        {view === "week" ? <WeekView /> : <MonthView />}
      </div>
    </div>
  );
};

export default TimetableCalendar;