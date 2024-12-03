import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LeaderboardData, Member } from "@/types/members";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

type HeatmapCell = {
  stars: number;
  timestamps: {
    star1?: number;
    star2?: number;
  };
};

const COLORS = ["bg-gray-200", "bg-blue-400", "bg-blue-700"];

export function LeaderboardHeatmap({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = useState("");

  const processedData = Object.values(data.members).map((member) => {
    const dayData: Record<number, HeatmapCell> = {};

    for (let i = 1; i <= 25; i++) {
      dayData[i] = { stars: 0, timestamps: {} };
    }

    Object.entries(member.completion_day_level).forEach(([day, completion]) => {
      const dayNum = parseInt(day);
      dayData[dayNum] = {
        stars: Object.keys(completion).length,
        timestamps: {
          star1: completion["1"]?.get_star_ts,
          star2: completion["2"]?.get_star_ts,
        },
      };
    });

    return {
      name: member.name,
      days: dayData,
    };
  });

  const filteredData = processedData.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Completion Heatmap</CardTitle>
          <CardDescription>
            Track daily puzzle completion progress for each member
          </CardDescription>
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative w-full overflow-x-auto">
            <div className="inline-grid w-full">
              {/* Days header */}
              <div className="grid grid-cols-[200px_repeat(25,minmax(32px,1fr))] gap-1 cursor-default">
                <div /> {/* Empty cell for alignment */}
                {Array.from({ length: 25 }, (_, i) => (
                  <div key={i + 1} className="text-sm font-medium text-center">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="grid grid-cols-[200px_repeat(25,minmax(32px,1fr))] gap-1 cursor-default">
                {filteredData.map((member) => (
                  <>
                    <div className="right-0 py-2 pr-4 text-sm font-medium bg-background z-10 text-right">
                      {member.name}
                    </div>

                    {/* Member's completion cells */}
                    {Object.entries(member.days).map(([day, data]) => (
                      <Tooltip key={`${member.name}-${day}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "h-8 w-10 rounded-md transition-colors cursor-default mx-auto", // Added w-8 and mx-auto
                              {
                                "bg-muted": data.stars === 0,
                                "bg-primary/50 ring-primary border-primary":
                                  data.stars === 1,
                                "bg-primary ring-primary": data.stars === 2,
                                "hover:opacity-80": true,
                              }
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border border-border">
                          <div className="text-xs">
                            <p className="font-medium">{member.name}</p>
                            <p>
                              Day {day}: {data.stars} ⭐
                            </p>
                            {data.timestamps.star1 && (
                              <p>
                                First star:{" "}
                                {new Date(
                                  data.timestamps.star1 * 1000
                                ).toLocaleTimeString()}
                              </p>
                            )}
                            {data.timestamps.star2 && (
                              <p>
                                Second star:{" "}
                                {new Date(
                                  data.timestamps.star2 * 1000
                                ).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
