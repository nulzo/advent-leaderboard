import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Home, Trophy, Users, Waves, Menu, ChartNoAxesColumn, ChartSpline, Clock, Hourglass, Star } from 'lucide-react'
import { cn } from '@/utils/cn'
import { paths } from '@/config/paths'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const navItems = [
  { icon: Home, label: 'Overview', path: paths.app.root.path },
  { icon: ChartNoAxesColumn, label: 'Points per Day', path: paths.app.root.path + '/points' },
  { icon: ChartSpline, label: 'Delta Stats', path: paths.app.delta.path },
  { icon: Waves, label: 'Heatmap', path: paths.app.heatmap.path },
  { icon: Waves, label: 'Points', path: paths.app.points.path },
  { icon: Star, label: 'Star Completion', path: paths.app.root.path + '/completion' },
  { icon: Hourglass, label: 'Time per Star', path: paths.app.root.path + '/time' },
]

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ width: isOpen ? 256 : 80 }}
      animate={{ width: isOpen ? 256 : 80 }}
      className="h-screen border-r bg-card fixed left-0 top-0"
    >
      <div className="p-4 flex items-center justify-between">
        <h2 className={cn(
          "font-semibold transition-opacity",
          isOpen ? "opacity-100" : "opacity-0"
        )}>
          Dashboard
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              !isOpen && "justify-center"
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={20} className="mr-2" />
            <span className={cn(
              "transition-opacity",
              isOpen ? "opacity-100" : "opacity-0 hidden"
            )}>
              {item.label}
            </span>
          </Button>
        ))}
      </nav>
    </motion.aside>
  )
}