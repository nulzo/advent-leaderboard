import { LeaderboardData } from "@/types/members";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface CompletionMatrixProps {
  data: LeaderboardData;
  figureNumber?: string;
}

export function CompletionMatrix({ data, figureNumber = "2.1" }: CompletionMatrixProps) {
  const { members, days } = (() => {
    const sortedMembers = Object.values(data.members)
      .filter(m => m.stars > 0)
      .sort((a, b) => b.local_score - a.local_score);

    let maxDay = 1;
    sortedMembers.forEach(member => {
      Object.keys(member.completion_day_level).forEach(day => {
        maxDay = Math.max(maxDay, parseInt(day));
      });
    });

    return {
      members: sortedMembers,
      days: Array.from({ length: maxDay }, (_, i) => i + 1),
    };
  })();

  const getStarStatus = (member: typeof members[0], day: number) => {
    const dayData = member.completion_day_level[day];
    if (!dayData) return 0;
    if (dayData["2"]) return 2;
    if (dayData["1"]) return 1;
    return 0;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header */}
            <div className="flex border-b-2 border-foreground">
              <div className="w-32 shrink-0 p-2 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Participant
              </div>
              {days.map(day => (
                <div 
                  key={day} 
                  className="w-8 shrink-0 p-2 text-center text-[10px] font-mono font-bold text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              <div className="w-16 shrink-0 p-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total
              </div>
            </div>

            {/* Rows */}
            {members.map((member, memberIndex) => (
              <div 
                key={member.id} 
                className={cn(
                  "flex border-b border-border hover:bg-muted/30 transition-colors",
                  memberIndex === 0 && "bg-muted/20"
                )}
              >
                <div className="w-32 shrink-0 p-2 text-right text-sm font-medium truncate" title={member.name}>
                  {member.name}
                </div>
                {days.map(day => {
                  const stars = getStarStatus(member, day);
                  const dayData = member.completion_day_level[day];
                  
                  return (
                    <Tooltip key={`${member.id}-${day}`}>
                      <TooltipTrigger asChild>
                        <div className="w-8 shrink-0 p-1 flex items-center justify-center">
                          <div 
                            className={cn(
                              "w-5 h-5 transition-colors",
                              stars === 0 && "bg-muted",
                              stars === 1 && "bg-muted-foreground/40",
                              stars === 2 && "bg-foreground"
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      {stars > 0 && (
                        <TooltipContent 
                          className="bg-popover border-2 border-border text-popover-foreground p-3 shadow-lg"
                          side="top"
                        >
                          <div className="text-xs font-mono space-y-1">
                            <div className="font-bold">{member.name} — Day {day}</div>
                            {dayData?.["1"] && (
                              <div>★ First: {formatTime(dayData["1"].get_star_ts)}</div>
                            )}
                            {dayData?.["2"] && (
                              <div>★★ Second: {formatTime(dayData["2"].get_star_ts)}</div>
                            )}
                            {dayData?.["1"] && dayData?.["2"] && (
                              <div className="text-muted-foreground">
                                Δ {Math.round((dayData["2"].get_star_ts - dayData["1"].get_star_ts) / 60)} min
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
                <div className="w-16 shrink-0 p-2 text-center font-mono font-bold">
                  {member.stars}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted border border-border" />
            <span className="text-muted-foreground">Not attempted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted-foreground/40" />
            <span className="text-muted-foreground">One star</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-foreground" />
            <span className="text-muted-foreground">Both stars</span>
          </div>
        </div>

        {/* Figure caption */}
        <p className="text-sm text-muted-foreground max-w-2xl">
          <span className="font-bold text-foreground">Figure {figureNumber}.</span> Completion matrix showing star status 
          for each participant (rows) across competition days (columns). Participants are sorted by total score.
        </p>
      </div>
    </TooltipProvider>
  );
}
