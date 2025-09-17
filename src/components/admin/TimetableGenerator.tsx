import { useState } from "react";
import { Zap, Settings, Clock, Users, Building2, AlertTriangle, CheckCircle, Play, Plus, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface Constraint {
  id: string;
  type: "professor" | "room" | "time" | "preference";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  enabled: boolean;
}

interface GenerationResult {
  success: boolean;
  conflicts: number;
  utilization: number;
  message: string;
  suggestions?: string[];
}

const TimetableGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  
  const [settings, setSettings] = useState({
    semester: "Fall 2024",
    startDate: "2024-09-01",
    endDate: "2024-12-15",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timeSlots: {
      start: "08:00",
      end: "18:00",
      duration: 90,
      breakDuration: 15
    },
    optimization: {
      preferMorning: true,
      minimizeGaps: true,
      balanceWorkload: true,
      respectPreferences: true
    },
    priorities: {
      facultyPreferences: 85,
      roomOptimization: 70,
      studentConvenience: 90,
      resourceUtilization: 60
    }
  });

  const [constraints, setConstraints] = useState<Constraint[]>([
    {
      id: "1",
      type: "professor",
      title: "Dr. Smith - Morning Preference",
      description: "Prefers classes before 12:00 PM",
      priority: "high",
      enabled: true
    },
    {
      id: "2",
      type: "professor",
      title: "Prof. Johnson - Lab Requirements",
      description: "Physics labs need 2-hour continuous slots",
      priority: "high",
      enabled: true
    },
    {
      id: "3",
      type: "room",
      title: "Lab 205 - Special Equipment",
      description: "Reserved for advanced physics experiments",
      priority: "medium",
      enabled: true
    },
    {
      id: "4",
      type: "time",
      title: "No Friday Afternoon Classes",
      description: "Avoid scheduling after 2 PM on Fridays",
      priority: "low",
      enabled: false
    },
    {
      id: "5",
      type: "preference",
      title: "Minimize Building Changes",
      description: "Keep related courses in same building",
      priority: "medium",
      enabled: true
    }
  ]);

  const [customConstraints, setCustomConstraints] = useState("");

  const handleConstraintToggle = (id: string) => {
    setConstraints(constraints.map(constraint => 
      constraint.id === id 
        ? { ...constraint, enabled: !constraint.enabled }
        : constraint
    ));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationResult(null);

    // Simulate generation process
    const steps = [
      "Analyzing constraints...",
      "Optimizing faculty schedules...",
      "Allocating classroom resources...",
      "Resolving conflicts...",
      "Finalizing timetable..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress((i + 1) * 20);
    }

    // Simulate result
    const enabledConstraints = constraints.filter(c => c.enabled);
    const conflicts = Math.max(0, 5 - enabledConstraints.length);
    const utilization = 75 + Math.random() * 20;

    setGenerationResult({
      success: conflicts === 0,
      conflicts,
      utilization: Math.round(utilization),
      message: conflicts === 0 
        ? "Timetable generated successfully with no conflicts!"
        : `Generated with ${conflicts} minor conflict${conflicts > 1 ? 's' : ''}. Review suggestions below.`,
      suggestions: conflicts > 0 ? [
        "Consider enabling 'No Friday Afternoon Classes' constraint",
        "Dr. Smith has 3 consecutive classes on Wednesday - consider redistributing",
        "Room utilization could be improved by 12% with different time allocations"
      ] : undefined
    });

    setIsGenerating(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium": return "bg-warning/20 text-warning border-warning/30";
      case "low": return "bg-success/20 text-success border-success/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Timetable Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered automatic timetable generation with constraint optimization
          </p>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="glow-primary"
          size="lg"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Generating...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Generate Timetable
            </div>
          )}
        </Button>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Generating Timetable...</h3>
                <span className="text-sm text-muted-foreground">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                This may take a few minutes depending on the complexity of constraints.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Result */}
      {generationResult && (
        <Alert className={generationResult.success ? "border-success/50 bg-success/5" : "border-warning/50 bg-warning/5"}>
          <div className="flex items-center gap-2">
            {generationResult.success ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-warning" />
            )}
            <AlertDescription>
              <div className="space-y-3">
                <p><strong>{generationResult.message}</strong></p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Conflicts:</span>
                    <span className={`ml-2 font-medium ${generationResult.conflicts === 0 ? 'text-success' : 'text-warning'}`}>
                      {generationResult.conflicts}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Utilization:</span>
                    <span className="ml-2 font-medium text-primary">{generationResult.utilization}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Constraints Met:</span>
                    <span className="ml-2 font-medium text-success">
                      {constraints.filter(c => c.enabled).length}/{constraints.length}
                    </span>
                  </div>
                </div>

                {generationResult.suggestions && (
                  <div>
                    <p className="font-medium mb-2">Suggestions for improvement:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {generationResult.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Settings */}
          <Card className="gradient-card border-0 card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={settings.semester}
                    onChange={(e) => setSettings({...settings, semester: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={settings.startDate}
                    onChange={(e) => setSettings({...settings, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={settings.endDate}
                    onChange={(e) => setSettings({...settings, endDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Working Days</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Monday - Friday" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mon-fri">Monday - Friday</SelectItem>
                      <SelectItem value="mon-sat">Monday - Saturday</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Time Slot Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={settings.timeSlots.start}
                      onChange={(e) => setSettings({
                        ...settings,
                        timeSlots: {...settings.timeSlots, start: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={settings.timeSlots.end}
                      onChange={(e) => setSettings({
                        ...settings,
                        timeSlots: {...settings.timeSlots, end: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Class Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="30"
                      max="180"
                      step="15"
                      value={settings.timeSlots.duration}
                      onChange={(e) => setSettings({
                        ...settings,
                        timeSlots: {...settings.timeSlots, duration: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Break Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="10"
                      max="60"
                      step="5"
                      value={settings.timeSlots.breakDuration}
                      onChange={(e) => setSettings({
                        ...settings,
                        timeSlots: {...settings.timeSlots, breakDuration: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Optimization Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="preferMorning"
                      checked={settings.optimization.preferMorning}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        optimization: {...settings.optimization, preferMorning: checked as boolean}
                      })}
                    />
                    <Label htmlFor="preferMorning">Prefer morning classes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="minimizeGaps"
                      checked={settings.optimization.minimizeGaps}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        optimization: {...settings.optimization, minimizeGaps: checked as boolean}
                      })}
                    />
                    <Label htmlFor="minimizeGaps">Minimize gaps between classes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="balanceWorkload"
                      checked={settings.optimization.balanceWorkload}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        optimization: {...settings.optimization, balanceWorkload: checked as boolean}
                      })}
                    />
                    <Label htmlFor="balanceWorkload">Balance faculty workload</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="respectPreferences"
                      checked={settings.optimization.respectPreferences}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        optimization: {...settings.optimization, respectPreferences: checked as boolean}
                      })}
                    />
                    <Label htmlFor="respectPreferences">Respect faculty preferences</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority Weights */}
          <Card className="gradient-card border-0 card-shadow">
            <CardHeader>
              <CardTitle>Priority Weights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Faculty Preferences</Label>
                    <span className="text-sm text-muted-foreground">{settings.priorities.facultyPreferences}%</span>
                  </div>
                  <Slider
                    value={[settings.priorities.facultyPreferences]}
                    onValueChange={([value]) => setSettings({
                      ...settings,
                      priorities: {...settings.priorities, facultyPreferences: value}
                    })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Room Optimization</Label>
                    <span className="text-sm text-muted-foreground">{settings.priorities.roomOptimization}%</span>
                  </div>
                  <Slider
                    value={[settings.priorities.roomOptimization]}
                    onValueChange={([value]) => setSettings({
                      ...settings,
                      priorities: {...settings.priorities, roomOptimization: value}
                    })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Student Convenience</Label>
                    <span className="text-sm text-muted-foreground">{settings.priorities.studentConvenience}%</span>
                  </div>
                  <Slider
                    value={[settings.priorities.studentConvenience]}
                    onValueChange={([value]) => setSettings({
                      ...settings,
                      priorities: {...settings.priorities, studentConvenience: value}
                    })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Resource Utilization</Label>
                    <span className="text-sm text-muted-foreground">{settings.priorities.resourceUtilization}%</span>
                  </div>
                  <Slider
                    value={[settings.priorities.resourceUtilization]}
                    onValueChange={([value]) => setSettings({
                      ...settings,
                      priorities: {...settings.priorities, resourceUtilization: value}
                    })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Constraints Panel */}
        <div className="space-y-6">
          <Card className="gradient-card border-0 card-shadow">
            <CardHeader>
              <CardTitle>Active Constraints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {constraints.map((constraint) => (
                  <div key={constraint.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Checkbox
                            checked={constraint.enabled}
                            onCheckedChange={() => handleConstraintToggle(constraint.id)}
                          />
                          <div className="text-sm font-medium">{constraint.title}</div>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">{constraint.description}</p>
                      </div>
                      <Badge className={getPriorityColor(constraint.priority)}>
                        {constraint.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 card-shadow">
            <CardHeader>
              <CardTitle>Custom Constraints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter additional constraints or requirements..."
                  value={customConstraints}
                  onChange={(e) => setCustomConstraints(e.target.value)}
                  rows={4}
                />
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Constraint
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 card-shadow">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm">Faculty Members</span>
                </div>
                <Badge variant="secondary">18</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Classrooms</span>
                </div>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm">Courses</span>
                </div>
                <Badge variant="secondary">45</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm">Time Slots</span>
                </div>
                <Badge variant="secondary">40</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;