
import React, { useState } from "react";
import { Bell, BookOpen, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import AttendanceChart from "@/components/attendance/AttendanceChart";
import QRDisplay from "@/components/attendance/QRDisplay";
import WhatsAppNotification from "@/components/notifications/WhatsAppNotification";

// Sample data for the dashboard
const ATTENDANCE_DATA = [
  { date: "2023-09-01", present: 24, absent: 3, late: 2 },
  { date: "2023-09-02", present: 22, absent: 5, late: 2 },
  { date: "2023-09-03", present: 25, absent: 2, late: 2 },
  { date: "2023-09-04", present: 23, absent: 4, late: 2 },
  { date: "2023-09-05", present: 21, absent: 6, late: 2 },
  { date: "2023-09-06", present: 26, absent: 1, late: 2 },
  { date: "2023-09-07", present: 24, absent: 3, late: 2 },
];

const STUDENT_DATA = [
  { id: "STU001", name: "Alex Johnson", status: "present", timeIn: "08:45 AM" },
  { id: "STU002", name: "Maria Garcia", status: "late", timeIn: "09:15 AM" },
  { id: "STU003", name: "James Smith", status: "absent", timeIn: "" },
  { id: "STU004", name: "Emma Wilson", status: "present", timeIn: "08:50 AM" },
  { id: "STU005", name: "David Brown", status: "present", timeIn: "08:30 AM" },
  { id: "STU006", name: "Sophie Taylor", status: "late", timeIn: "09:05 AM" },
  { id: "STU007", name: "Michael Davis", status: "absent", timeIn: "" },
  { id: "STU008", name: "Olivia Miller", status: "present", timeIn: "08:55 AM" },
  { id: "STU009", name: "Daniel Anderson", status: "present", timeIn: "08:40 AM" },
  { id: "STU010", name: "Ava Thomas", status: "late", timeIn: "09:20 AM" },
];

interface StatusCounts {
  present: number;
  absent: number;
  late: number;
  total: number;
}

const TeacherDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const { toast } = useToast();
  
  // Filter students based on search query and selected class
  const filteredStudents = STUDENT_DATA.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate status counts
  const statusCounts: StatusCounts = filteredStudents.reduce(
    (counts, student) => {
      counts[student.status as keyof Pick<StatusCounts, "present" | "absent" | "late">] += 1;
      return counts;
    },
    { present: 0, absent: 0, late: 0, total: filteredStudents.length }
  );
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="absolute inset-0 bg-noise pointer-events-none"></div>
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Manage attendance, view statistics, and send notifications
            </p>
          </div>
          
          <Button onClick={() => toast({ title: "Generate reports", description: "Reports are being generated, please wait." })}>
            Generate Reports
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusCounts.total}</div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusCounts.present}</div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusCounts.absent}</div>
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-red-600 dark:text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusCounts.late}</div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="attendance" className="mt-6">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-auto p-0">
            <TabsTrigger value="attendance" className="px-4 py-2 data-[state=active]:bg-primary/5">
              Attendance
            </TabsTrigger>
            <TabsTrigger value="qr-code" className="px-4 py-2 data-[state=active]:bg-primary/5">
              QR Code
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-4 py-2 data-[state=active]:bg-primary/5">
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-5">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                  <CardDescription>
                    Last 7 days attendance statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttendanceChart chartData={ATTENDANCE_DATA} />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader className="space-y-0 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Students</CardTitle>
                    <Input
                      placeholder="Search students..."
                      className="max-w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-2 font-medium">ID</th>
                            <th className="text-left pb-2 font-medium">Name</th>
                            <th className="text-left pb-2 font-medium">Status</th>
                            <th className="text-left pb-2 font-medium">Time In</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className="border-b last:border-0">
                              <td className="py-3">{student.id}</td>
                              <td className="py-3">{student.name}</td>
                              <td className="py-3">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  student.status === "present" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                    : student.status === "late" 
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" 
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}>
                                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-3">{student.timeIn || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Statistics</CardTitle>
                <CardDescription>
                  Comprehensive view of the weekly attendance patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceChart chartData={ATTENDANCE_DATA} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qr-code" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <QRDisplay />
              
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Instructions</CardTitle>
                  <CardDescription>
                    How to use QR code for attendance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">1. Generate a QR Code</h3>
                    <p className="text-sm text-muted-foreground">
                      Select your class and generate a unique QR code for today's attendance.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">2. Display to Students</h3>
                    <p className="text-sm text-muted-foreground">
                      Display the QR code on your screen or projector for students to scan.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">3. Students Scan</h3>
                    <p className="text-sm text-muted-foreground">
                      Students scan the QR code using the attendance app on their devices.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">4. Automatic Check-in</h3>
                    <p className="text-sm text-muted-foreground">
                      The system automatically records attendance upon successful scan.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    QR codes expire after 60 seconds for security. Generate a new one if needed.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <WhatsAppNotification 
                studentData={STUDENT_DATA.map(s => ({ id: s.id, name: s.name }))} 
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Notification Templates</CardTitle>
                  <CardDescription>
                    Manage and customize notification templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Absence Alert</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sent when a student is marked absent
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Late Arrival</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sent when a student arrives late
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Weekly Report</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Weekly attendance summary sent to parents
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
