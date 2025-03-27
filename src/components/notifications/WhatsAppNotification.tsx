
import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sendWhatsAppNotification, formatPhoneForTwilio, generateAttendanceMessage } from "@/lib/twilio";

interface WhatsAppNotificationProps {
  studentData?: {
    id: string;
    name: string;
  }[];
  className?: string;
}

const WhatsAppNotification: React.FC<WhatsAppNotificationProps> = ({ 
  studentData = [], 
  className = ""
}) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"absent" | "late" | "present">("absent");
  const [parentPhone, setParentPhone] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [isLoading, setIsLoading] = useState(false);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setParentPhone(formatted);
  };

  // Update default message when student or status changes
  const updateDefaultMessage = () => {
    const student = studentData.find(s => s.id === selectedStudent);
    const studentName = student?.name || "Student";
    const today = new Date().toLocaleDateString();
    
    const defaultMessage = generateAttendanceMessage(
      studentName,
      selectedStatus,
      subject,
      today
    );
    
    setMessage(defaultMessage);
  };

  // Send WhatsApp notification
  const handleSendNotification = async () => {
    if (!parentPhone) {
      toast.error("Please enter parent's phone number");
      return;
    }
    
    if (!message) {
      toast.error("Please enter a message");
      return;
    }
    
    const student = studentData.find(s => s.id === selectedStudent);
    
    setIsLoading(true);
    
    try {
      const success = await sendWhatsAppNotification({
        to: formatPhoneForTwilio(parentPhone),
        message,
        studentName: student?.name,
        subject,
        date: new Date().toLocaleDateString(),
        status: selectedStatus
      });
      
      if (success) {
        toast.success("WhatsApp notification sent", {
          description: `Message sent to ${parentPhone}`
        });
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error);
      toast.error("Failed to send WhatsApp notification", {
        description: "Please check the phone number and try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`shadow ${className}`}>
      <CardHeader>
        <CardTitle>Send WhatsApp Notification</CardTitle>
        <CardDescription>
          Send attendance notifications to parents via WhatsApp
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="student-select" className="text-sm font-medium">
            Student
          </label>
          <Select 
            value={selectedStudent} 
            onValueChange={(value) => {
              setSelectedStudent(value);
              updateDefaultMessage();
            }}
          >
            <SelectTrigger id="student-select">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {studentData.length ? (
                studentData.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="demo" disabled>
                  No students available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              updateDefaultMessage();
            }}
            placeholder="Enter subject name"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="attendance-status" className="text-sm font-medium">
            Attendance Status
          </label>
          <Select 
            value={selectedStatus} 
            onValueChange={(value: "absent" | "late" | "present") => {
              setSelectedStatus(value);
              updateDefaultMessage();
            }}
          >
            <SelectTrigger id="attendance-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="present">Present</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="parent-phone" className="text-sm font-medium">
            Parent's Phone Number
          </label>
          <Input
            id="parent-phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={parentPhone}
            onChange={handlePhoneChange}
          />
          <p className="text-xs text-muted-foreground">
            Enter the phone number with country code (e.g., US numbers will automatically get +1)
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            rows={4}
          />
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-sm text-amber-600 dark:text-amber-500">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>This will send a real WhatsApp message</span>
          </div>
          <Button
            onClick={handleSendNotification}
            disabled={isLoading || !parentPhone || !message}
            className="ml-auto"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WhatsAppNotification;
