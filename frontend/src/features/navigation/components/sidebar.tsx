import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  X,
  Home,
  Table,
  Menu,
  ChartLine,
  Grid3X3,
  Clock,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { paths } from "@/config/paths";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
}

const navItems = [
  { icon: Home, label: "Overview", path: paths.app.root.path },
  { icon: ChartLine, label: "§1 Performance", path: paths.app.points.path },
  { icon: Grid3X3, label: "§2 Matrix", path: paths.app.heatmap.path },
  { icon: Clock, label: "§3 Delta", path: paths.app.delta.path },
  { icon: Table, label: "Raw Data", path: paths.app.table.path },
];

// Sidebar widths
const SIDEBAR_WIDTH_OPEN = 260;
const SIDEBAR_WIDTH_CLOSED = 64;

export const Sidebar = ({ isOpen, setIsOpen, isMobile }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Mobile: Full-screen overlay sidebar
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -SIDEBAR_WIDTH_OPEN }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_WIDTH_OPEN }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed left-0 top-0 z-50 h-screen flex flex-col bg-sidebar border-r-2 border-foreground"
              style={{ width: SIDEBAR_WIDTH_OPEN }}
            >
              {/* Header */}
              <div className="flex h-16 items-center justify-between px-4 border-b-2 border-foreground">
                <h1 className="font-bold text-lg tracking-tight uppercase">AOC 2025</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 rounded-none hover:bg-sidebar-accent"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start rounded-none h-12 px-4 transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                          : "hover:bg-sidebar-accent text-sidebar-foreground"
                      )}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <item.icon size={20} className="shrink-0" />
                      <span className="ml-3 text-sm font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
              
              {/* Footer */}
              <div className="p-4 border-t-2 border-foreground">
                <span className="text-xs text-muted-foreground font-mono">
                  Built by <span className="text-foreground font-bold">@nulzo</span>
                </span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop/Tablet: Collapsible sidebar
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="fixed left-0 top-0 z-40 h-screen flex flex-col bg-sidebar border-r-2 border-foreground overflow-hidden"
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b-2 border-foreground">
        {/* Title - fixed width container that clips */}
        <div 
          className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ width: isOpen ? SIDEBAR_WIDTH_OPEN - SIDEBAR_WIDTH_CLOSED : 0 }}
        >
          <div className="px-4 whitespace-nowrap">
            <h1 className="font-bold text-lg tracking-tight uppercase">AOC 2025</h1>
          </div>
        </div>
        
        {/* Toggle button - always in fixed position */}
        <div 
          className="flex items-center justify-center shrink-0"
          style={{ width: SIDEBAR_WIDTH_CLOSED }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-10 w-10 rounded-none hover:bg-sidebar-accent"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "w-full rounded-none h-11 px-0 transition-colors",
                // When closed, center the icon; when open, left-align
                isOpen ? "justify-start" : "justify-center",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              {/* Icon container - fixed width for consistent centering */}
              <div 
                className="flex items-center justify-center shrink-0"
                style={{ width: SIDEBAR_WIDTH_CLOSED }}
              >
                <item.icon size={18} />
              </div>
              
              {/* Label - clips smoothly */}
              <div 
                className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ width: isOpen ? SIDEBAR_WIDTH_OPEN - SIDEBAR_WIDTH_CLOSED - 16 : 0 }}
              >
                <span className="text-sm font-medium whitespace-nowrap pr-4">
                  {item.label}
                </span>
              </div>
            </Button>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div 
        className="border-t-2 border-foreground overflow-hidden transition-all duration-300"
        style={{ 
          height: isOpen ? 56 : 0,
          opacity: isOpen ? 1 : 0,
          padding: isOpen ? '1rem' : 0
        }}
      >
        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
          Built by <span className="text-foreground font-bold">@nulzo</span>
        </span>
      </div>
    </motion.aside>
  );
};

// Mobile menu button component for the header
export const MobileMenuButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className="h-10 w-10 rounded-none hover:bg-accent md:hidden"
  >
    <Menu size={20} />
  </Button>
);
