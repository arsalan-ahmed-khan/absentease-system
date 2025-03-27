
import { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const mockAttendanceData = [
  { subject: "Mathematics", present: 12, absent: 2, late: 1 },
  { subject: "Physics", present: 10, absent: 4, late: 1 },
  { subject: "Chemistry", present: 13, absent: 1, late: 1 },
  { subject: "Biology", present: 11, absent: 3, late: 1 },
  { subject: "Computer Science", present: 14, absent: 1, late: 0 },
];

const mockTrendData = [
  { week: "Week 1", attendance: 95 },
  { week: "Week 2", attendance: 87 },
  { week: "Week 3", attendance: 92 },
  { week: "Week 4", attendance: 90 },
  { week: "Week 5", attendance: 94 },
  { week: "Week 6", attendance: 96 },
];

const COLORS = ["#4f46e5", "#ef4444", "#f59e0b"];

const AttendanceChart = () => {
  const [activeTab, setActiveTab] = useState("bar");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    setAnimate(true);
  }, []);

  const pieData = [
    { name: "Present", value: 85 },
    { name: "Absent", value: 10 },
    { name: "Late", value: 5 },
  ];

  return (
    <Card className={`shadow-sm border overflow-hidden ${animate ? "animate-scale-up" : "opacity-0"}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Attendance Overview</CardTitle>
        <CardDescription>
          Summary of attendance patterns and trends
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="bar" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bar">Subject Analysis</TabsTrigger>
              <TabsTrigger value="pie">Overall Status</TabsTrigger>
              <TabsTrigger value="line">Trend</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="bar" className="mt-0 pt-3">
            <div className="h-[300px] w-full px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockAttendanceData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subject" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #eeeeee',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar name="Present" dataKey="present" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar name="Absent" dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar name="Late" dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="pie" className="mt-0 pt-3">
            <div className="h-[300px] w-full px-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #eeeeee',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="line" className="mt-0 pt-3">
            <div className="h-[300px] w-full px-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockTrendData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis 
                    fontSize={12} 
                    domain={[70, 100]} 
                    label={{ 
                      value: 'Attendance %', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #eeeeee',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    name="Attendance %" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
