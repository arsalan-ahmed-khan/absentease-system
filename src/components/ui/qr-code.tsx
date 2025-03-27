
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface QRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  renderAs?: "svg" | "canvas";
  includeMargin?: boolean;
  className?: string;
  showTimer?: boolean;
  expirationSeconds?: number;
  onExpire?: () => void;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  level = "H",
  renderAs = "svg",
  includeMargin = true,
  className = "",
  showTimer = false,
  expirationSeconds = 60,
  onExpire,
}) => {
  const [QRCodeComponent, setQRCodeComponent] = useState<React.ComponentType<any> | null>(null);
  const [timeLeft, setTimeLeft] = useState(expirationSeconds);
  const [expired, setExpired] = useState(false);

  // Dynamically import the QRCode library to avoid SSR issues
  useEffect(() => {
    import("qrcode.react").then((module) => {
      setQRCodeComponent(() => module.QRCode);
    });
  }, []);

  // Handle countdown timer if enabled
  useEffect(() => {
    if (!showTimer) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer, onExpire]);

  if (!QRCodeComponent) {
    // Return a placeholder while the QRCode component is loading
    return (
      <div
        className={`flex items-center justify-center bg-muted animate-pulse ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="sr-only">Loading QR Code...</span>
      </div>
    );
  }

  const formattedTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="relative">
      <Card
        className={`qr-container transition-opacity ${
          expired ? "opacity-50" : "opacity-100"
        } ${className}`}
      >
        <QRCodeComponent
          value={value}
          size={size}
          level={level}
          renderAs={renderAs}
          includeMargin={includeMargin}
          className="mx-auto"
        />
        {expired && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-xl">
            <span className="text-destructive font-medium">QR Code Expired</span>
          </div>
        )}
      </Card>
      
      {showTimer && !expired && (
        <div className="qr-timer animate-pulse-slow">
          {timeLeft}
        </div>
      )}
    </div>
  );
};

export default QRCode;
