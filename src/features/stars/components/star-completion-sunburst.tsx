import * as React from "react";
import { ResponsiveContainer, Treemap } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardData } from "@/types/members";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StarCompletionSunburst({ data }: { data: LeaderboardData }) {
  const [viewMode, setViewMode] = React.useState<"day" | "member">("day");

  const processedData = React.useMemo(() => {
    if (viewMode === "day") {
      return {
        name: "Stars",
        children: Array.from({ length: 25 }, (_, i) => {
          const day = i + 1;
          const dayCompletions = Object.values(data.members).filter(
            (m) => m.completion_day_level[day]?.["2"]
          );
          return {
            name: `Day ${day}`,
            size: dayCompletions.length,
            children: dayCompletions.map((m) => ({
              name: m.name,
              size: 1,
            })),
          };
        }),
      };
    } else {
      return {
        name: "Stars",
        children: Object.values(data.members).map((member) => ({
          name: member.name,
          size: member.stars,
          children: Object.entries(member.completion_day_level).map(([day, stars]) => ({
            name: `Day ${day}`,
            size: Object.keys(stars).length,
          })),
        })),
      };
    }
  }, [data, viewMode]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Completion Distribution</CardTitle>
        <CardDescription>
          Hierarchical view of star completions
        </CardDescription>
        <Select value={viewMode} onValueChange={(v) => setViewMode(v as "day" | "member")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Group by Day</SelectItem>
            <SelectItem value="member">Group by Member</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={[processedData]}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#fff"
              content={({ root, depth, x, y, width, height, name, value }) => (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                      fill: `hsl(${(depth * 120) % 360}, 70%, ${50 + depth * 10}%)`,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                  {width > 30 && height > 30 && (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={12}
                    >
                      {`${name} (${value})`}
                    </text>
                  )}
                </g>
              )}
            />
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}