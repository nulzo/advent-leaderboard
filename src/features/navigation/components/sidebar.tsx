import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, Home, Table, Waves, Menu, ChartNoAxesColumn, ChartSpline, Hourglass, Star } from 'lucide-react'
import { cn } from '@/utils/cn'
import { paths } from '@/config/paths'
import { PanelLeft } from 'lucide-react' // Add this import


interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const navItems = [
  { icon: Home, label: 'Overview', path: paths.app.root.path },
  { icon: Table, label: 'Data Tables', path: paths.app.table.path },
  { icon: ChartSpline, label: 'Delta Stats', path: paths.app.delta.path },
  { icon: Waves, label: 'Heatmaps', path: paths.app.heatmap.path },
  { icon: ChartNoAxesColumn, label: 'Points Stats', path: paths.app.points.path },
  { icon: Star, label: 'Star Completion', path: paths.app.stars.path },
  { icon: Hourglass, label: 'Time per Star', path: paths.app.root.path + '/time' },
]

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      initial={{ width: isOpen ? 256 : 57 }}
      animate={{ width: isOpen ? 256 : 57 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="top-0 left-0 fixed flex flex-col bg-card border-r h-screen"
    >
      <div className="flex items-center px-3 border-b h-14">
        {isOpen && (
          <div className="flex flex-col items-start">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-foreground text-sm"
            >
              Advent of Code Stats
            </motion.span>
            <motion.span
              initial={false}
              animate={{
                opacity: isOpen ? 1 : 0,
                width: isOpen ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-xs overflow-hidden whitespace-nowrap",
              )}
            >
              made by <a href="https://github.com/nulzo" className="font-bold text-primary">@nulzo</a>
            </motion.span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-8 w-8 rounded-lg",
            "hover:bg-accent/50",
            isOpen ? "ml-auto" : "mx-auto" // Centers button when closed, pushes to right when open
          )}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <PanelLeft size={16} />
          </motion.div>
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "w-full relative h-10",
                "hover:bg-accent/50 flex items-center justify-start", // Changed to justify-start
                isActive && "bg-accent/60 hover:bg-accent/60",
                "pl-3 pr-4" // Fixed left padding for consistent icon placement
              )}
              onClick={() => navigate(item.path)}
            >
              {/* Left-justified icon */}
              <item.icon
                size={18}
                className={cn(
                  "shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />

              {/* Text appears directly after icon */}
              <motion.span
                initial={false}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  width: isOpen ? "auto" : 0,
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "ml-3 text-sm overflow-hidden whitespace-nowrap",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </motion.span>
            </Button>
          );
        })}
      </nav>
    </motion.aside>
  );
};