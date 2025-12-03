import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LeaderboardData, Member } from "@/types/members"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

type SortConfig = {
  key: keyof Member | 'avgSolveTime'
  direction: 'asc' | 'desc'
}

export function LeaderboardTable({ data }: { data: LeaderboardData }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'stars', 
    direction: 'desc' 
  })
  
  const itemsPerPage = 15

  // Calculate average solve time for each member
  const membersWithAvgTime = Object.values(data.members).map(member => {
    const completedPuzzles = Object.values(member.completion_day_level).filter(day => 
      day['1']?.get_star_ts && day['2']?.get_star_ts
    )
    
    const totalTime = completedPuzzles.reduce((sum, day) => {
      return sum + (day['2'].get_star_ts - day['1'].get_star_ts)
    }, 0)

    const avgTime = completedPuzzles.length > 0 
      ? totalTime / (completedPuzzles.length * 60) // Convert to minutes
      : 0

    return {
      ...member,
      avgSolveTime: avgTime
    }
  })

  // Sort members
  const getSortedMembers = () => {
    return [...membersWithAvgTime].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })
  }

  // Filter members by search term
  const getFilteredMembers = () => {
    return getSortedMembers().filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Get paginated members
  const getPaginatedMembers = () => {
    const filtered = getFilteredMembers()
    const startIndex = (currentPage - 1) * itemsPerPage
    return filtered.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = Math.ceil(getFilteredMembers().length / itemsPerPage)

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const SortIndicator = ({ column }: { column: SortConfig['key'] }) => {
    if (sortConfig.key !== column) return null
    return sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search */}
      <div className="flex items-center space-x-3 md:space-x-4 border border-input px-3 py-1 bg-background focus-within:ring-1 ring-ring transition-all">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input
          placeholder="SEARCH..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 px-0 h-9 uppercase placeholder:text-xs"
        />
      </div>
      
      {/* Table - horizontal scroll on mobile */}
      <div className="border border-border bg-card overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[640px] md:min-w-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[60px] md:w-[80px] text-xs md:text-sm">#</TableHead>
                <TableHead className="text-xs md:text-sm">
                  <div 
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 md:gap-2 cursor-pointer hover:text-foreground transition-colors"
                  >
                    Name
                    <SortIndicator column="name" />
                  </div>
                </TableHead>
                <TableHead className="text-xs md:text-sm">
                  <div 
                    onClick={() => handleSort('stars')}
                    className="flex items-center gap-1 md:gap-2 cursor-pointer hover:text-foreground transition-colors"
                  >
                    ★
                    <SortIndicator column="stars" />
                  </div>
                </TableHead>
                <TableHead className="text-xs md:text-sm">
                  <div 
                    onClick={() => handleSort('local_score')}
                    className="flex items-center gap-1 md:gap-2 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <span className="hidden sm:inline">Local</span> Score
                    <SortIndicator column="local_score" />
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell text-xs md:text-sm">
                  <div 
                    onClick={() => handleSort('global_score')}
                    className="flex items-center gap-1 md:gap-2 cursor-pointer hover:text-foreground transition-colors"
                  >
                    Global
                    <SortIndicator column="global_score" />
                  </div>
                </TableHead>
                <TableHead className="text-xs md:text-sm">
                  <div 
                    onClick={() => handleSort('avgSolveTime')}
                    className="flex items-center gap-1 md:gap-2 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <span className="hidden sm:inline">Avg.</span> Time
                    <SortIndicator column="avgSolveTime" />
                  </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell text-xs md:text-sm">Last Star</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getPaginatedMembers().map((member, index) => (
                <TableRow key={member.id} className="group">
                  <TableCell className="font-mono text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    #{String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell className="font-bold text-xs md:text-sm max-w-[100px] md:max-w-none truncate">
                    {member.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs md:text-sm text-accent-foreground/80">
                    {member.stars}
                  </TableCell>
                  <TableCell className="font-mono text-xs md:text-sm">{member.local_score}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs md:text-sm">
                    {member.global_score}
                  </TableCell>
                  <TableCell className="font-mono text-xs md:text-sm">
                    {member.avgSolveTime > 0 
                      ? `${member.avgSolveTime.toFixed(1)}m`
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-[10px] md:text-xs text-muted-foreground">
                    {member.last_star_ts 
                      ? new Date(member.last_star_ts * 1000).toLocaleDateString()
                      : '-'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-border">
        <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Page {currentPage} / {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-20 md:w-24 text-xs"
          >
            PREV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-20 md:w-24 text-xs"
          >
            NEXT
          </Button>
        </div>
      </div>
    </div>
  )
}
