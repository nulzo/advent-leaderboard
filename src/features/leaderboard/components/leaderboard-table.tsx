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
import { ChevronDown, ChevronUp } from "lucide-react"

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
    return sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      
      <div className="rounded-lg border bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1"
                >
                  Name
                  <SortIndicator column="name" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('stars')}
                  className="flex items-center gap-1"
                >
                  Stars
                  <SortIndicator column="stars" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('local_score')}
                  className="flex items-center gap-1"
                >
                  Local Score
                  <SortIndicator column="local_score" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('global_score')}
                  className="flex items-center gap-1"
                >
                  Global Score
                  <SortIndicator column="global_score" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('avgSolveTime')}
                  className="flex items-center gap-1"
                >
                  Avg. Solve Time
                  <SortIndicator column="avgSolveTime" />
                </Button>
              </TableHead>
              <TableHead>Last Star</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getPaginatedMembers().map((member, index) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.stars}</TableCell>
                <TableCell>{member.local_score}</TableCell>
                <TableCell>{member.global_score}</TableCell>
                <TableCell>
                  {member.avgSolveTime > 0 
                    ? `${member.avgSolveTime.toFixed(1)} mins`
                    : 'N/A'
                  }
                </TableCell>
                <TableCell>
                  {member.last_star_ts 
                    ? new Date(member.last_star_ts * 1000).toLocaleString()
                    : 'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}