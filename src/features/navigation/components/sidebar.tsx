import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  X,
  Home,
  Table,
  Waves,
  Menu,
  ChartNoAxesColumn,
  ChartSpline,
  Hourglass,
  Star,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { paths } from "@/config/paths";
import { PanelLeft } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems = [
  { icon: Home, label: "Overview", path: paths.app.root.path },
  { icon: Table, label: "Data Tables", path: paths.app.table.path },
  { icon: ChartSpline, label: "Delta Stats", path: paths.app.delta.path },
  { icon: Waves, label: "Heatmaps", path: paths.app.heatmap.path },
  {
    icon: ChartNoAxesColumn,
    label: "Points Stats",
    path: paths.app.points.path,
  },
  { icon: Star, label: "Star Completion", path: paths.app.stars.path },
  {
    icon: Hourglass,
    label: "Time per Star",
    path: paths.app.root.path + "/time",
  },
];

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      initial={{ width: isOpen ? 320 : 72 }}
      animate={{ width: isOpen ? 320 : 72 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="top-0 left-0 fixed flex flex-col bg-background border-r-4 border-foreground h-screen font-['Inter',helvetica,sans-serif]"
    >
      {/* Header */}
      <div className="flex items-center h-20 border-b-2 border-black px-4">
        <div className="flex items-center overflow-hidden">
          <motion.div
            initial={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="whitespace-nowrap overflow-hidden"
          >
            <h1 className="font-bold text-xl">Advent of Code</h1>
            <span className="text-sm font-medium">Statistics Dashboard</span>
          </motion.div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 rounded-non ml-auto"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "w-full h-10 rounded-none border-2",
                "flex items-center justify-start px-4", // Always left-aligned
                isActive
                  ? "border-black bg-black text-white"
                  : "border-transparent hover:border-black hover:bg-transparent"
              )}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center gap-4">
                <item.icon
                  size={18}
                  className={cn(
                    "shrink-0",
                    isActive ? "text-white" : "text-black"
                  )}
                />

                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    width: isOpen ? "auto" : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              </div>
            </Button>
          );
        })}
      </nav>
    </motion.aside>
  );
};
