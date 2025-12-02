import { motion } from "framer-motion";
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
}

const navItems = [
  { icon: Home, label: "Overview", path: paths.app.root.path },
  { icon: ChartLine, label: "§1 Performance", path: paths.app.points.path },
  { icon: Grid3X3, label: "§2 Matrix", path: paths.app.heatmap.path },
  { icon: Clock, label: "§3 Delta", path: paths.app.delta.path },
  { icon: Table, label: "Raw Data", path: paths.app.table.path },
];

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      initial={{ width: isOpen ? 280 : 64 }}
      animate={{ width: isOpen ? 280 : 64 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 z-40 h-screen flex flex-col bg-sidebar border-r border-sidebar-border"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center overflow-hidden">
          <motion.div
            initial={{ opacity: isOpen ? 1 : 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap overflow-hidden"
          >
            <h1 className="font-bold text-lg tracking-tight uppercase">AOC 2025</h1>
          </motion.div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 rounded-none hover:bg-sidebar-accent"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-none h-10 px-3 transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon
                size={18}
                className={cn("shrink-0", !isOpen && "mx-auto")}
              />
              
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 text-sm font-medium truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </Button>
          );
        })}
      </nav>
      
      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-sidebar-border">
          <span className="text-xs text-muted-foreground font-mono">
            Built by <span className="text-foreground font-bold">@nulzo</span>
          </span>
        </div>
      )}
    </motion.aside>
  );
};
