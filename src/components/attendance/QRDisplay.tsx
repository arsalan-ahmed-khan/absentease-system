
import { useState, useEffect } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCode from "@/components/ui/qr-code";
import { toast } from "sonner";

// Mock subjects
const SUBJECTS = [
  { id: "math101", name: "Mathematics 101" },
  { id: "phys201", name: "Physics 201" },
  { id: "chem101", name: "Chemistry 101" },
  { id: "bio101", name: "Biology 101" },
  { id: "cs102", name: "Computer Science 102" },
];

interface QRDisplayProps {
  className?: string;
}

const QRDisplay: React.FC<QRDisplayProps> = ({ className = "" }) => {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].id);
  const [qrValue, setQrValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate QR code data for the selected subject
  const generateQRCode = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const timestamp = new Date().toISOString();
      const randomId = Math.random().toString(36).substring(2, 10);
      const subject = SUBJECTS.find(s => s.id === selectedSubject);
      
      // Create QR code data
      const qrData = JSON.stringify({
        subjectId: selectedSubject,
        subjectName: subject?.name,
        timestamp,
        sessionId: randomId,
        expires: new Date(Date.now() + 60000).toISOString() // 1 minute expiration
      });
      
      setQrValue(qrData);
      setIsLoading(false);
      toast.success("New QR code generated", {
        description: `QR code for ${subject?.name} will expire in 60 seconds`
      });
    }, 600);
  };

  // Handle QR code expiration
  const handleExpire = () => {
    toast.info("QR code expired", {
      description: "The QR code has expired. Please generate a new one."
    });
    setQrValue("");
  };

  // Generate QR code when subject changes or on initial load
  useEffect(() => {
    generateQRCode();
  }, [selectedSubject]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Attendance QR Code</CardTitle>
        <CardDescription>
          Generate a QR code for your students to scan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="subject-select" className="text-sm font-medium">
            Select Subject
          </label>
          <Select 
            value={selectedSubject} 
            onValueChange={(value) => setSelectedSubject(value)}
          >
            <SelectTrigger id="subject-select" className="w-full">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center py-4">
          {qrValue ? (
            <QRCode 
              value={qrValue} 
              size={200} 
              showTimer 
              expirationSeconds={60} 
              onExpire={handleExpire}
            />
          ) : (
            <div className="h-[200px] w-[200px] flex items-center justify-center border border-dashed border-muted-foreground/50 rounded-xl">
              <span className="text-muted-foreground">No QR code generated</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>Expires in 60 seconds</span>
        </div>
        <Button 
          onClick={generateQRCode} 
          disabled={isLoading}
          size="sm"
          className="gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRDisplay;
