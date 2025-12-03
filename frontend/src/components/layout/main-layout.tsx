import { useState, useEffect } from 'react'
import { Sidebar, MobileMenuButton } from '@/features/navigation/components/sidebar'
import { cn } from '@/lib/utils'
import { ModeToggle } from '../mode-toggle'
import { useLeaderboard, useRefreshLeaderboard } from '@/features/leaderboard/hooks/use-leaderboard'
import { RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'

// Sidebar widths - keep in sync with sidebar.tsx
const SIDEBAR_WIDTH_OPEN = 260;
const SIDEBAR_WIDTH_CLOSED = 64;

function formatLastUpdated(timestamp: number | undefined): string {
  if (!timestamp) return 'Never';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Custom hook for responsive breakpoints
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  
  // Start with sidebar closed on mobile/tablet, open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Update sidebar state when breakpoint changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else if (isTablet) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile, isTablet]);

  const { data, isFetching } = useLeaderboard()
  const { refresh } = useRefreshLeaderboard()

  // Use backend's last_fetched timestamp if available
  const lastFetched = data?._meta?.last_fetched

  // Calculate content margin based on sidebar state
  const getContentMargin = () => {
    if (isMobile) return 'ml-0';
    if (isSidebarOpen) return `ml-[${SIDEBAR_WIDTH_OPEN}px]`;
    return `ml-[${SIDEBAR_WIDTH_CLOSED}px]`;
  };

  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isMobile={isMobile}
      />
      
      <div 
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isMobile ? "ml-0" : isSidebarOpen ? "ml-[260px]" : "ml-[64px]"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b-2 border-foreground bg-background px-4 md:px-6 justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            {isMobile && (
              <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
            )}
            
            {/* Backend refresh status */}
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground">
              <span className="uppercase tracking-[0.15em] font-bold hidden sm:inline">Backend:</span>
              <span className="font-mono">{formatLastUpdated(lastFetched)}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-none hover:bg-accent" 
                onClick={refresh}
                disabled={isFetching}
              >
                <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
              </Button>
            </div>
          </div>
          
          <ModeToggle />
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          {children}
        </main>

        {/* Footer */}
        {/* <footer className="border-t-2 border-foreground px-4 md:px-6 py-4 mt-auto">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">Advent of Code 2025 — Private Leaderboard Analysis</span>
            <span className="font-mono">Built with precision by @nulzo</span>
          </div>
        </footer> */}
      </div>
    </div>
  )
}
