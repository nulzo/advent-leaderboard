import { useState } from 'react'
import { Sidebar } from '@/features/navigation/components/sidebar'
import { cn } from '@/lib/utils'
import { ModeToggle } from '../mode-toggle'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex bg-background w-full h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={cn(
        "flex-1 min-h-screen overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        <div className="mx-auto px-4 py-8 container">
          <div className="flex justify-end w-full">
            <ModeToggle />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}