import { useState } from 'react'
import { Sidebar } from '@/features/navigation/components/sidebar'
import { cn } from '@/lib/utils'
import { ModeToggle } from '../mode-toggle'
import { useLeaderboard, useRefreshLeaderboard } from '@/features/leaderboard/hooks/use-leaderboard'
import { RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'

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

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { data, isFetching } = useLeaderboard()
  const { refresh } = useRefreshLeaderboard()

  // Use backend's last_fetched timestamp if available
  const lastFetched = data?._meta?.last_fetched

  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isSidebarOpen ? "ml-[280px]" : "ml-[64px]"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="uppercase tracking-wider font-medium">Backend Refreshed:</span>
            <span className="font-mono">{formatLastUpdated(lastFetched)}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={refresh}
              disabled={isFetching}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            </Button>
          </div>
          <ModeToggle />
        </header>
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </main>
      </div>
    </div>
  )
}
