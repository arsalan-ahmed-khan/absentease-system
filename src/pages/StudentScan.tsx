import { useState, useEffect, useRef } from "react";
import { QrCode, CameraOff, Camera, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { addAttendance } from "@/lib/firestore";

type ScanState = "initial" | "scanning" | "success" | "error";

// Mock implementation of scanQRCode function
const mockScanQRCode = async (): Promise<string> => {
  return JSON.stringify({ subjectName: "Mathematics" });
};

const StudentScan = () => {
  const [studentId, setStudentId] = useState("");
  const [scanState, setScanState] = useState<ScanState>("initial");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize scanner when component mounts
  useEffect(() => {
    let mounted = true;
    
    // Import scanner library dynamically to avoid SSR issues
    const loadScanner = async () => {
      try {
        // Simulate dynamic import of QR scanner library
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (mounted) {
          setCameraReady(true);
        }
      } catch (error) {
        console.error("Error loading scanner:", error);
        toast.error("Failed to load QR scanner", {
          description: "Please refresh the page or try another device."
        });
      }
    };
    
    loadScanner();
    
    return () => {
      mounted = false;
      // Cleanup scanner when component unmounts
      if (scanState === "scanning") {
        stopScanner();
      }
    };
  }, []);

  // Start camera and QR scanning
  const startScanner = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      setScanState("scanning");
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      videoRef.current.srcObject = stream;
      
      // Simulate QR code detection after random interval (1-4 seconds)
      const detectionDelay = Math.floor(Math.random() * 3000) + 1000;
      
      setTimeout(() => {
        // 80% chance of successful scan, 20% chance of error
        const isSuccess = Math.random() < 0.8;
        
        if (isSuccess) {
          // Simulate successful QR scan
          handleScanSuccess();
        } else {
          // Simulate scan error
          handleScanError("Invalid or expired QR code");
        }
      }, detectionDelay);
      
    } catch (error) {
      console.error("Error starting camera:", error);
      toast.error("Camera access denied", {
        description: "Please allow camera access to scan QR codes."
      });
      setScanState("error");
    }
  };

  // Stop camera and scanning
  const stopScanner = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setScanState("initial");
  };

  // Handle successful QR scan
  const handleScanSuccess = async () => {
    if (!studentId) {
      handleScanError("Please enter your student ID");
      return;
    }

    try {
      // Simulate QR code scanning
      const qrCodeData = await mockScanQRCode(); // Replace with actual QR code scanning logic
      const parsedData = JSON.parse(qrCodeData);

      // Validate QR code data from Firestore
      // Mock implementation of fetchQRCodeData function
      const fetchQRCodeData = async (subjectId: string): Promise<any[]> => {
        // Replace this with actual API call or Firestore query
        return subjectId ? [{ id: 1, subjectId }] : [];
      };
      
            const qrCodeRecords = await fetchQRCodeData(parsedData.subjectId);
      if (!qrCodeRecords.length) {
        throw new Error("Invalid or expired QR code");
      }

      const record = {
        studentId,
        subject: parsedData.subjectName,
        status: "present",
        timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split("T")[0],
      };

      await addAttendance(record);
      setScanResult(qrCodeData);
      setScanState("success");

      toast.success("Attendance marked successfully", {
        description: `You're marked present for ${parsedData.subjectName}`
      });

      stopScanner();
    } catch (error) {
      console.error("Error processing QR code:", error);
      handleScanError("Failed to process QR code. Please try again.");
    }
  };

  // Handle QR scan error
  const handleScanError = (errorMessage: string) => {
    setScanState("error");
    setScanResult(errorMessage);
    toast.error("Scan failed", {
      description: errorMessage
    });
    
    // Stop the camera
    stopScanner();
  };

  // Render different UI based on scan state
  const renderScannerContent = () => {
    switch (scanState) {
      case "initial":
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-8">
            <div className="p-3 bg-primary/10 rounded-full">
              <QrCode className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Ready to Scan</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Enter your student ID and tap the button below to start scanning the QR code
              </p>
            </div>
            <Button
              onClick={startScanner}
              className="w-full max-w-xs flex items-center justify-center gap-2"
              disabled={!cameraReady || !studentId}
            >
              <Camera className="h-4 w-4" />
              Start Scanning
            </Button>
          </div>
        );
        
      case "scanning":
        return (
          <div className="p-4 relative">
            <div className="relative rounded-lg overflow-hidden bg-black aspect-square max-w-xs mx-auto">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Scanner overlay */}
              <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg" />
              
              {/* Scanner targeting lines */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary" />
              </div>
              
              {/* Scanning animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 animate-[scanning_2s_ease-in-out_infinite]" />
            </div>
            
            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">Scanning QR code...</p>
              <Button
                variant="outline"
                onClick={stopScanner}
                className="mt-4"
                size="sm"
              >
                <CameraOff className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );
        
      case "success":
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-8">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Attendance Marked!</h3>
              <p className="text-muted-foreground">
                Your attendance has been successfully recorded
              </p>
              
              {scanResult && (
                <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium">Class: {JSON.parse(scanResult).subjectName}</p>
                  <p className="text-xs text-muted-foreground">
                    Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
            <Button
              onClick={() => setScanState("initial")}
              className="w-full max-w-xs"
            >
              Scan Another Code
            </Button>
          </div>
        );
        
      case "error":
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-8">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <X className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Scan Failed</h3>
              <p className="text-muted-foreground">
                {scanResult || "Unable to scan QR code. Please try again."}
              </p>
            </div>
            <Button
              onClick={() => setScanState("initial")}
              className="w-full max-w-xs"
            >
              Try Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="absolute inset-0 bg-noise pointer-events-none"></div>
      <Navbar />
      
      <div className="container px-4 py-24 mx-auto">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Student QR Scanner</h1>
            <p className="text-muted-foreground">
              Scan the QR code displayed by your teacher to mark attendance
            </p>
          </div>
          
          <Card className="shadow-lg border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>Attendance Scanner</CardTitle>
              <CardDescription>
                Enter your student ID and scan the QR code
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input
                    id="student-id"
                    placeholder="Enter your student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    disabled={scanState === "scanning"}
                  />
                </div>
                
                <div 
                  ref={scannerContainerRef}
                  className="bg-muted rounded-lg overflow-hidden"
                >
                  {renderScannerContent()}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t bg-muted/30 px-6 py-4">
              <p className="text-xs text-muted-foreground">
                Make sure your camera is enabled and the QR code is clearly visible
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentScan;
