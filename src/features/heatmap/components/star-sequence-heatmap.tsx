import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

export function StarSequenceHeatmap({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    const sequenceMap = [];
    const filteredMembers = Object.values(data.members).filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredMembers.forEach(member => {
      // Get all star completions for this member
      const completions = Object.entries(member.completion_day_level)
        .flatMap(([day, stars]) =>
          Object.entries(stars).map(([star, data]) => ({
            day: parseInt(day),
            star: parseInt(star),
            timestamp: data.get_star_ts
          }))
        )
        .sort((a, b) => a.timestamp - b.timestamp);

      // Track sequence of completions
      completions.forEach((completion, index) => {
        const nextCompletions = completions.slice(index + 1, index + 4);
        nextCompletions.forEach((next, seqIndex) => {
          sequenceMap.push({
            x: completion.day,
            y: next.day,
            value: seqIndex + 1,
            member: member.name,
            timeDelta: (next.timestamp - completion.timestamp) / 3600 // hours
          });
        });
      });
    });

    return sequenceMap;
  }, [data, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Completion Sequence Patterns</CardTitle>
        <CardDescription>
          Visualizing the patterns in the order of star completions
        </CardDescription>
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="x"
                domain={[1, 25]}
                label={{ value: "From Day", position: "bottom" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={[1, 25]}
                label={{ value: "To Day", angle: -90, position: "insideLeft" }}
              />
              <ZAxis
                type="number"
                dataKey="timeDelta"
                range={[50, 400]}
              />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === "timeDelta") return `${Math.round(Number(value))} hours`;
                  return value;
                }}
                content={({ payload }) => {
                  if (!payload?.[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background shadow-md p-2 border rounded-md">
                      <p className="font-medium">{data.member}</p>
                      <p>From Day {data.x} to Day {data.y}</p>
                      <p>Time: {Math.round(data.timeDelta)} hours</p>
                      <p>Sequence: {data.value} of 3</p>
                    </div>
                  );
                }}
              />
              <Scatter data={processedData}>
                {processedData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={`hsl(${entry.value * 120}, 70%, 50%)`}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}