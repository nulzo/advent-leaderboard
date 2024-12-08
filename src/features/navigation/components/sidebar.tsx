import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
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
      className="top-0 left-0 fixed flex flex-col border-foreground bg-background border-r-4 h-screen font-['Inter',helvetica,sans-serif]"
    >
      {/* Header */}
      <div className="flex items-center border-foreground px-4 h-20">
        <div className="flex items-center overflow-hidden">
          <motion.div
            initial={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="whitespace-nowrap overflow-hidden"
          >
            <h1 className="font-bold text-xl">AOC Leaderboard</h1>
            <span className="font-medium text-sm">made by <span className="font-bold text-primary">@nulzo</span></span>
          </motion.div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto rounded-non w-10 h-10"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          console.log(location.pathname, item.path);
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "w-full h-10 rounded border-2",
                "flex items-center justify-start px-4", // Always left-aligned
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-transparent hover:border-foreground hover:bg-transparent"
              )}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center gap-4">
                <item.icon
                  size={18}
                  className={cn(
                    "shrink-0",
                    isActive ? "text-background" : "text-foreground"
                  )}
                />

                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    width: isOpen ? "auto" : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
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
