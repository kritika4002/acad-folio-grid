import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { 
  BookOpen, 
  Users, 
  Building2, 
  Zap, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  User,
  Calendar,
  Settings,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminSidebar from "./AdminSidebar";
import CourseManagement from "./admin/CourseManagement";
import FacultyManagement from "./admin/FacultyManagement";
import ClassroomManagement from "./admin/ClassroomManagement";
import TimetableGenerator from "./admin/TimetableGenerator";

interface ClassItem {
  id: string;
  subject: string;
  instructor: string;
  duration: number;
  room?: string;
  timeSlot?: string;
  students: number;
  type: "lecture" | "lab" | "tutorial";
  color: "math" | "science" | "english" | "history" | "art" | "pe";
}

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  room: string;
  capacity: number;
}

interface Conflict {
  id: string;
  type: "instructor" | "room" | "student";
  message: string;
  affectedClasses: string[];
}

type AdminView = "dashboard" | "courses" | "faculty" | "classrooms" | "generator";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  
  const [unassignedClasses, setUnassignedClasses] = useState<ClassItem[]>([
    {
      id: "class-1",
      subject: "Advanced Mathematics",
      instructor: "Dr. Smith",
      duration: 90,
      students: 30,
      type: "lecture",
      color: "math"
    },
    {
      id: "class-2",
      subject: "Physics Lab",
      instructor: "Prof. Johnson",
      duration: 120,
      students: 15,
      type: "lab",
      color: "science"
    },
    {
      id: "class-3",
      subject: "English Literature",
      instructor: "Ms. Davis",
      duration: 60,
      students: 25,
      type: "tutorial",
      color: "english"
    }
  ]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "monday-9", day: "Monday", time: "09:00-10:30", room: "Room 101", capacity: 40 },
    { id: "monday-11", day: "Monday", time: "11:00-12:30", room: "Room 101", capacity: 40 },
    { id: "tuesday-9", day: "Tuesday", time: "09:00-10:30", room: "Lab 205", capacity: 20 },
    { id: "tuesday-14", day: "Tuesday", time: "14:00-15:30", room: "Room 304", capacity: 35 },
  ]);

  const [scheduledClasses, setScheduledClasses] = useState<Map<string, ClassItem>>(new Map());
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  // Detect conflicts when classes are scheduled
  const detectConflicts = (newSchedule: Map<string, ClassItem>) => {
    const detectedConflicts: Conflict[] = [];
    const instructorSchedule = new Map<string, string[]>();
    const roomSchedule = new Map<string, string[]>();

    newSchedule.forEach((classItem, slotId) => {
      const slot = timeSlots.find(s => s.id === slotId);
      if (!slot) return;

      // Check instructor conflicts
      if (!instructorSchedule.has(classItem.instructor)) {
        instructorSchedule.set(classItem.instructor, []);
      }
      const instructorSlots = instructorSchedule.get(classItem.instructor)!;
      const timeKey = `${slot.day}-${slot.time}`;
      
      if (instructorSlots.includes(timeKey)) {
        detectedConflicts.push({
          id: `conflict-${Date.now()}-instructor`,
          type: "instructor",
          message: `${classItem.instructor} has conflicting classes`,
          affectedClasses: [classItem.id]
        });
      } else {
        instructorSlots.push(timeKey);
      }

      // Check room conflicts
      if (!roomSchedule.has(slot.room)) {
        roomSchedule.set(slot.room, []);
      }
      const roomSlots = roomSchedule.get(slot.room)!;
      
      if (roomSlots.includes(timeKey)) {
        detectedConflicts.push({
          id: `conflict-${Date.now()}-room`,
          type: "room",
          message: `${slot.room} is double-booked`,
          affectedClasses: [classItem.id]
        });
      } else {
        roomSlots.push(timeKey);
      }

      // Check capacity conflicts
      if (classItem.students > slot.capacity) {
        detectedConflicts.push({
          id: `conflict-${Date.now()}-capacity`,
          type: "room",
          message: `${slot.room} capacity (${slot.capacity}) insufficient for ${classItem.students} students`,
          affectedClasses: [classItem.id]
        });
      }
    });

    setConflicts(detectedConflicts);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Moving from unassigned to schedule
    if (source.droppableId === "unassigned" && destination.droppableId.startsWith("slot-")) {
      const classItem = unassignedClasses.find(c => c.id === draggableId);
      if (!classItem) return;

      const slotId = destination.droppableId.replace("slot-", "");
      const newScheduledClasses = new Map(scheduledClasses);
      newScheduledClasses.set(slotId, classItem);

      const newUnassignedClasses = unassignedClasses.filter(c => c.id !== draggableId);
      
      setScheduledClasses(newScheduledClasses);
      setUnassignedClasses(newUnassignedClasses);
      detectConflicts(newScheduledClasses);
    }
    
    // Moving from schedule back to unassigned
    if (source.droppableId.startsWith("slot-") && destination.droppableId === "unassigned") {
      const slotId = source.droppableId.replace("slot-", "");
      const classItem = scheduledClasses.get(slotId);
      if (!classItem) return;

      const newScheduledClasses = new Map(scheduledClasses);
      newScheduledClasses.delete(slotId);
      
      const newUnassignedClasses = [...unassignedClasses, classItem];
      
      setScheduledClasses(newScheduledClasses);
      setUnassignedClasses(newUnassignedClasses);
      detectConflicts(newScheduledClasses);
    }

    // Moving between time slots
    if (source.droppableId.startsWith("slot-") && destination.droppableId.startsWith("slot-")) {
      const sourceSlotId = source.droppableId.replace("slot-", "");
      const destSlotId = destination.droppableId.replace("slot-", "");
      
      if (sourceSlotId === destSlotId) return;

      const classItem = scheduledClasses.get(sourceSlotId);
      if (!classItem) return;

      const newScheduledClasses = new Map(scheduledClasses);
      newScheduledClasses.delete(sourceSlotId);
      newScheduledClasses.set(destSlotId, classItem);
      
      setScheduledClasses(newScheduledClasses);
      detectConflicts(newScheduledClasses);
    }
  };

  const renderDashboardView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Timetable Administrator
          </h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop classes to schedule, with automatic conflict detection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setScheduledClasses(new Map())} variant="outline" size="sm">
            Clear All
          </Button>
          <Button size="sm" className="glow-primary">
            <Zap className="w-4 h-4 mr-2" />
            Auto Schedule
          </Button>
        </div>
      </div>

      {/* Conflict Alerts */}
      {conflicts.length > 0 && (
        <div className="space-y-2">
          {conflicts.map((conflict) => (
            <Alert key={conflict.id} variant="destructive" className="border-destructive/20 bg-destructive/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{conflict.type === "instructor" ? "Instructor" : "Room"} Conflict:</strong> {conflict.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="lecture">Lectures</SelectItem>
            <SelectItem value="lab">Labs</SelectItem>
            <SelectItem value="tutorial">Tutorials</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Unassigned Classes */}
          <Card className="gradient-card border-0 card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Unassigned Classes
                <Badge variant="secondary" className="ml-auto">
                  {unassignedClasses.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="unassigned">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[400px] p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-muted/50' : ''
                    }`}
                  >
                    {unassignedClasses
                      .filter(classItem => 
                        filterType === "all" || classItem.type === filterType
                      )
                      .filter(classItem =>
                        classItem.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        classItem.instructor.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((classItem, index) => (
                      <Draggable key={classItem.id} draggableId={classItem.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-lg border transition-smooth cursor-move ${
                              snapshot.isDragging 
                                ? 'shadow-lg scale-105 rotate-2' 
                                : 'hover:shadow-md'
                            } subject-${classItem.color}`}
                          >
                            <div className="font-medium text-sm">{classItem.subject}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <User className="w-3 h-3" />
                              <span className="text-xs">{classItem.instructor}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{classItem.duration}min</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {classItem.type}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Timetable Grid */}
          <div className="xl:col-span-3">
            <Card className="gradient-card border-0 card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Weekly Timetable
                  <Badge variant="secondary" className="ml-auto">
                    {scheduledClasses.size} scheduled
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                    <div key={day} className="space-y-3">
                      <h3 className="font-semibold text-sm text-center py-2 bg-muted/30 rounded-lg">
                        {day}
                      </h3>
                      <div className="space-y-2">
                        {timeSlots
                          .filter(slot => slot.day === day)
                          .map((slot) => {
                            const scheduledClass = scheduledClasses.get(slot.id);
                            const hasConflict = conflicts.some(conflict => 
                              scheduledClass && conflict.affectedClasses.includes(scheduledClass.id)
                            );
                            
                            return (
                              <Droppable key={slot.id} droppableId={`slot-${slot.id}`}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`min-h-[100px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                                      snapshot.isDraggingOver 
                                        ? 'border-primary bg-primary/10' 
                                        : scheduledClass
                                          ? hasConflict 
                                            ? 'border-destructive bg-destructive/10'
                                            : 'border-success bg-success/10'
                                          : 'border-muted bg-muted/10'
                                    }`}
                                  >
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {slot.time}
                                    </div>
                                    <div className="text-xs flex items-center gap-1 mb-2">
                                      <MapPin className="w-3 h-3" />
                                      {slot.room}
                                    </div>
                                    
                                    {scheduledClass && (
                                      <Draggable draggableId={scheduledClass.id} index={0}>
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`p-2 rounded-md cursor-move transition-smooth ${
                                              snapshot.isDragging 
                                                ? 'shadow-lg scale-105' 
                                                : ''
                                            } ${hasConflict ? 'bg-destructive/20' : `subject-${scheduledClass.color}`}`}
                                          >
                                            <div className="font-medium text-xs">{scheduledClass.subject}</div>
                                            <div className="text-xs opacity-80">{scheduledClass.instructor}</div>
                                            {hasConflict && (
                                              <div className="flex items-center gap-1 mt-1">
                                                <AlertTriangle className="w-3 h-3 text-destructive" />
                                                <span className="text-xs text-destructive">Conflict</span>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </Draggable>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DragDropContext>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case "courses":
        return <CourseManagement />;
      case "faculty":
        return <FacultyManagement />;
      case "classrooms":
        return <ClassroomManagement />;
      case "generator":
        return <TimetableGenerator />;
      default:
        return renderDashboardView();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 p-6 ml-64">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;