
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, QrCode, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Track scroll position for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-card/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <QrCode className="h-6 w-6 text-primary" />
            <span className="font-display font-medium text-lg">AbsentEase</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/teacher-login"
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                location.pathname === "/teacher-login"
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <User className="h-4 w-4" />
                <span>Teacher Login</span>
              </span>
            </Link>
            <Link
              to="/student-scan"
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                location.pathname === "/student-scan"
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <QrCode className="h-4 w-4" />
                <span>Scan QR</span>
              </span>
            </Link>
            <Link
              to="/parent-dashboard"
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                location.pathname === "/parent-dashboard"
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <Users className="h-4 w-4" />
                <span>Parent Portal</span>
              </span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link
              to="/teacher-login"
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/teacher-login"
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary"
              }`}
            >
              <User className="h-5 w-5" />
              <span>Teacher Login</span>
            </Link>
            <Link
              to="/student-scan"
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/student-scan"
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary"
              }`}
            >
              <QrCode className="h-5 w-5" />
              <span>Scan QR</span>
            </Link>
            <Link
              to="/parent-dashboard"
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/parent-dashboard"
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Parent Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
