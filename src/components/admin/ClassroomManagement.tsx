import { useState } from "react";
import { Building2, Plus, Search, Edit2, Trash2, MapPin, Users, Monitor, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface Equipment {
  id: string;
  name: string;
  quantity: number;
  working: number;
}

interface Classroom {
  id: string;
  number: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: "Lecture Hall" | "Laboratory" | "Seminar Room" | "Computer Lab" | "Studio" | "Auditorium";
  equipment: Equipment[];
  features: string[];
  availability: string[];
  currentOccupancy: number;
}

const ClassroomManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBuilding, setFilterBuilding] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "1",
      number: "101",
      name: "Main Lecture Hall",
      building: "Science Building",
      floor: 1,
      capacity: 120,
      type: "Lecture Hall",
      equipment: [
        { id: "1", name: "Projector", quantity: 2, working: 2 },
        { id: "2", name: "Microphone", quantity: 4, working: 3 },
        { id: "3", name: "Whiteboard", quantity: 2, working: 2 }
      ],
      features: ["Air Conditioning", "WiFi", "Audio System", "Recording Equipment"],
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      currentOccupancy: 0
    },
    {
      id: "2",
      number: "205",
      name: "Physics Laboratory",
      building: "Science Building",
      floor: 2,
      capacity: 30,
      type: "Laboratory",
      equipment: [
        { id: "4", name: "Lab Bench", quantity: 15, working: 14 },
        { id: "5", name: "Oscilloscope", quantity: 8, working: 6 },
        { id: "6", name: "Power Supply", quantity: 15, working: 15 }
      ],
      features: ["Fume Hood", "Emergency Shower", "Gas Lines", "Electrical Outlets"],
      availability: ["Monday", "Wednesday", "Friday"],
      currentOccupancy: 18
    },
    {
      id: "3",
      number: "304",
      name: "Seminar Room A",
      building: "Liberal Arts Building",
      floor: 3,
      capacity: 25,
      type: "Seminar Room",
      equipment: [
        { id: "7", name: "Smart Board", quantity: 1, working: 1 },
        { id: "8", name: "Conference Table", quantity: 1, working: 1 },
        { id: "9", name: "Chairs", quantity: 25, working: 25 }
      ],
      features: ["Natural Light", "WiFi", "Climate Control"],
      availability: ["Monday", "Tuesday", "Thursday", "Friday"],
      currentOccupancy: 22
    }
  ]);

  const buildings = ["Science Building", "Liberal Arts Building", "Engineering Building", "Administration Building"];
  const roomTypes = ["Lecture Hall", "Laboratory", "Seminar Room", "Computer Lab", "Studio", "Auditorium"];
  const commonEquipment = [
    "Projector", "Smart Board", "Whiteboard", "Microphone", "Speakers", "Computer", 
    "Lab Bench", "Oscilloscope", "Microscope", "Conference Table", "Chairs"
  ];
  const commonFeatures = [
    "Air Conditioning", "WiFi", "Audio System", "Recording Equipment", "Natural Light",
    "Blackout Curtains", "Emergency Equipment", "Fume Hood", "Gas Lines", "Electrical Outlets"
  ];

  const filteredClassrooms = classrooms.filter(room => {
    const matchesSearch = room.number.includes(searchQuery) ||
                         room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding = filterBuilding === "all" || room.building === filterBuilding;
    const matchesType = filterType === "all" || room.type === filterType;
    
    return matchesSearch && matchesBuilding && matchesType;
  });

  const [newClassroom, setNewClassroom] = useState<Partial<Classroom>>({
    number: "",
    name: "",
    building: "",
    floor: 1,
    capacity: 30,
    type: "Lecture Hall",
    equipment: [],
    features: [],
    availability: [],
    currentOccupancy: 0
  });

  const handleAddClassroom = () => {
    if (newClassroom.number && newClassroom.name && newClassroom.building) {
      const room: Classroom = {
        id: Date.now().toString(),
        equipment: [],
        features: [],
        availability: [],
        currentOccupancy: 0,
        ...newClassroom as Classroom
      };
      setClassrooms([...classrooms, room]);
      setNewClassroom({
        number: "",
        name: "",
        building: "",
        floor: 1,
        capacity: 30,
        type: "Lecture Hall",
        equipment: [],
        features: [],
        availability: [],
        currentOccupancy: 0
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteClassroom = (id: string) => {
    setClassrooms(classrooms.filter(room => room.id !== id));
  };

  const getOccupancyStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return { status: "full", color: "bg-destructive", text: "text-destructive" };
    if (percentage >= 70) return { status: "high", color: "bg-warning", text: "text-warning" };
    if (percentage >= 30) return { status: "moderate", color: "bg-primary", text: "text-primary" };
    return { status: "low", color: "bg-success", text: "text-success" };
  };

  const toggleFeature = (feature: string) => {
    setNewClassroom(prev => {
      const features = prev.features || [];
      if (features.includes(feature)) {
        return { ...prev, features: features.filter(f => f !== feature) };
      } else {
        return { ...prev, features: [...features, feature] };
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Classroom Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage classroom resources, equipment, and availability
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glow-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Classroom</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Room Number</Label>
                  <Input
                    id="number"
                    placeholder="e.g., 101"
                    value={newClassroom.number}
                    onChange={(e) => setNewClassroom({ ...newClassroom, number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main Lecture Hall"
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="building">Building</Label>
                  <Select value={newClassroom.building} onValueChange={(value) => setNewClassroom({ ...newClassroom, building: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map(building => (
                        <SelectItem key={building} value={building}>{building}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    min="1"
                    max="20"
                    value={newClassroom.floor}
                    onChange={(e) => setNewClassroom({ ...newClassroom, floor: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="500"
                    value={newClassroom.capacity}
                    onChange={(e) => setNewClassroom({ ...newClassroom, capacity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Room Type</Label>
                  <Select value={newClassroom.type} onValueChange={(value: any) => setNewClassroom({ ...newClassroom, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <Label>Room Features</Label>
                <div className="grid grid-cols-2 gap-3">
                  {commonFeatures.map(feature => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={newClassroom.features?.includes(feature) || false}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                      <Label htmlFor={feature} className="text-sm">{feature}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClassroom}>
                Add Classroom
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Rooms</p>
                <p className="text-2xl font-bold">{classrooms.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Capacity</p>
                <p className="text-2xl font-bold">{classrooms.reduce((sum, room) => sum + room.capacity, 0)}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Buildings</p>
                <p className="text-2xl font-bold">{buildings.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Utilization</p>
                <p className="text-2xl font-bold">
                  {Math.round(classrooms.reduce((sum, room) => sum + (room.currentOccupancy / room.capacity * 100), 0) / classrooms.length)}%
                </p>
              </div>
              <Monitor className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="gradient-card border-0 card-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search classrooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBuilding} onValueChange={setFilterBuilding}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Buildings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.map(building => (
                  <SelectItem key={building} value={building}>{building}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {roomTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Classroom Table */}
      <Card className="gradient-card border-0 card-shadow">
        <CardHeader>
          <CardTitle>Classroom Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassrooms.map((room) => {
                const occupancyStatus = getOccupancyStatus(room.currentOccupancy, room.capacity);
                const workingEquipment = room.equipment.filter(eq => eq.working === eq.quantity).length;
                const totalEquipment = room.equipment.length;
                
                return (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{room.number}</div>
                        <div className="text-sm text-muted-foreground">{room.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <div>
                          <div className="text-sm">{room.building}</div>
                          <div className="text-xs text-muted-foreground">Floor {room.floor}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {room.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {room.capacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${occupancyStatus.color}`} />
                          <span className={`text-sm font-medium ${occupancyStatus.text}`}>
                            {room.currentOccupancy}/{room.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1 rounded-full">
                          <div 
                            className={`h-full rounded-full ${occupancyStatus.color}`}
                            style={{ width: `${Math.min((room.currentOccupancy / room.capacity) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {room.features.slice(0, 2).map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {room.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.features.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Monitor className="w-4 h-4" />
                        <span className="text-sm">
                          {workingEquipment}/{totalEquipment} working
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteClassroom(room.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassroomManagement;