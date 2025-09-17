import { useState } from "react";
import { Calendar, Search, User, Users, Settings, Clock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TimetableCalendar from "./TimetableCalendar";
import Sidebar from "./Sidebar";
import AdminDashboard from "./AdminDashboard";

type ViewMode = "student" | "faculty" | "admin";
type CalendarView = "week" | "month";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<ViewMode>("student");
  const [calendarView, setCalendarView] = useState<CalendarView>("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const upcomingClasses = [
    { id: 1, subject: "Mathematics", time: "09:00 - 10:30", room: "Room 101", instructor: "Dr. Smith", color: "math" },
    { id: 2, subject: "Physics", time: "11:00 - 12:30", room: "Lab 205", instructor: "Prof. Johnson", color: "science" },
    { id: 3, subject: "English Literature", time: "14:00 - 15:30", room: "Room 304", instructor: "Ms. Davis", color: "english" },
  ];

  const stats = {
    student: { totalClasses: 24, completed: 18, upcoming: 6, attendance: "92%" },
    faculty: { totalClasses: 32, scheduled: 28, pending: 4, students: "156" },
    admin: { totalUsers: 1250, activeClasses: 180, departments: 8, utilization: "87%" }
  };

  // Render admin dashboard if in admin view
  if (currentView === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="flex-1 p-6 ml-64">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              {currentView === "student" ? "Student Dashboard" : 
               currentView === "faculty" ? "Faculty Dashboard" : 
               "Admin Panel"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant={calendarView === "week" ? "default" : "secondary"} 
              size="sm"
              onClick={() => setCalendarView("week")}
              className="transition-smooth"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Week
            </Button>
            <Button 
              variant={calendarView === "month" ? "default" : "secondary"} 
              size="sm"
              onClick={() => setCalendarView("month")}
              className="transition-smooth"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Month
            </Button>
            <Button variant="outline" size="sm" className="transition-smooth">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {Object.entries(stats[currentView]).map(([key, value]) => (
            <Card key={key} className="gradient-card border-0 card-shadow transition-smooth hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {key.includes('class') || key.includes('Class') ? <Calendar className="w-6 h-6 text-primary" /> :
                     key.includes('user') || key.includes('student') ? <Users className="w-6 h-6 text-primary" /> :
                     key.includes('attendance') || key.includes('utilization') ? <Clock className="w-6 h-6 text-primary" /> :
                     <Settings className="w-6 h-6 text-primary" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar - Takes up 3 columns */}
          <div className="xl:col-span-3">
            <Card className="gradient-card border-0 card-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Timetable Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TimetableCalendar 
                  view={calendarView}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  currentView={currentView}
                />
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Classes Sidebar */}
          <div className="xl:col-span-1">
            <Card className="gradient-card border-0 card-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingClasses.map((class_) => (
                  <div 
                    key={class_.id} 
                    className="p-4 rounded-lg border border-border bg-muted/30 transition-smooth hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className={`subject-${class_.color} border-0`}>
                        {class_.subject}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{class_.time}</span>
                    </div>
                    <p className="text-sm font-medium">{class_.room}</p>
                    <p className="text-xs text-muted-foreground">{class_.instructor}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;