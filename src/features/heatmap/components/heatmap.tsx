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
      <Input
        placeholder="Filter members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-2 border-foreground focus-visible:border-foreground mb-8 rounded-none focus-visible:ring-0 max-w-sm"
      />
      <div className="pt-12">
        <div className="relative w-full overflow-x-auto">
          <div className="inline-grid w-full">
            <div className="inline-grid w-full">
              {/* Days header */}
              <div className="gap-1 grid grid-cols-[200px_repeat(25,minmax(32px,1fr))] cursor-default">
                <div /> {/* Empty cell for alignment */}
                {Array.from({ length: 25 }, (_, i) => (
                  <div key={i + 1} className="font-medium text-center text-sm">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="gap-1 grid grid-cols-[200px_repeat(25,minmax(32px,1fr))] cursor-default">
                {filteredData.map((member) => (
                  <>
                    <div className="right-0 text-right z-10 bg-background py-2 pr-4 font-medium text-sm">
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
                        <TooltipContent className="bg-popover border border-border text-popover-foreground">
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
        </div>
      </div>
    </TooltipProvider>
  );
}
