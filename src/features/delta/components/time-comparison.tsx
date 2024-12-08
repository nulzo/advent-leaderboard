import * as React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LeaderboardData } from "@/types/members";

export function TimeComparison({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    // Get all days where at least one person completed both stars
    const completedDays = Array.from({ length: 25 }, (_, i) => i + 1)
      .filter(day =>
        Object.values(data.members).some(m =>
          m.completion_day_level[day]?.["1"] && m.completion_day_level[day]?.["2"]
        )
      )
      .slice(-7); // Take last 7 completed days

    // Calculate metrics for each member
    return completedDays.map(day => {
      const dayMetrics: Record<string, number> = {
        subject: `Day ${day}`,
      };

      Object.values(data.members)
        .filter(member =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          member.completion_day_level[day]?.["1"] &&
          member.completion_day_level[day]?.["2"]
        )
        .forEach(member => {
          const firstStar = member.completion_day_level[day]["1"].get_star_ts;
          const secondStar = member.completion_day_level[day]["2"].get_star_ts;
          const startOfDay = new Date(2023, 11, day).getTime() / 1000;

          // Calculate time to complete both stars in minutes
          const totalTime = Math.round((secondStar - startOfDay) / 60);
          dayMetrics[member.name] = totalTime;
        });

      return dayMetrics;
    });
  }, [data, searchTerm]);

  // Get filtered member names for the radar components
  const filteredMembers = React.useMemo(() =>
    Object.values(data.members)
      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(m => m.name),
    [data, searchTerm]
  );

  return (
    <>
      <Input
        placeholder="Filter members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-2 border-foreground focus-visible:border-foreground rounded-none focus-visible:ring-0 max-w-sm"
      />
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={processedData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid
              stroke="#000"
              strokeWidth={1}
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: '#000',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'ui-monospace, monospace'
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 'auto']}
              tick={{
                fill: '#000',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'ui-monospace, monospace'
              }}
              label={{
                value: "Minutes",
                position: "outside",
                style: {
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'ui-monospace, monospace'
                }
              }}
            />
            {filteredMembers.map((member, index) => (
              <Radar
                key={member}
                name={member}
                dataKey={member}
                stroke={`hsl(${(360 / filteredMembers.length) * index}, 70%, 50%)`}
                fill={`hsl(${(360 / filteredMembers.length) * index}, 70%, 50%)`}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="plainline"
              iconSize={18}
              wrapperStyle={{
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'ui-monospace, monospace'
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #000',
                borderRadius: 0,
                fontSize: 12,
                fontFamily: 'ui-monospace, monospace'
              }}
              formatter={(value) => [`${value} minutes`, ""]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}