import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

export function StarCompletionBubbles({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    return Object.values(data.members)
      .filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .flatMap((member) =>
        Object.entries(member.completion_day_level).flatMap(([day, stars]) => {
          const results = [];
          if (stars["1"]) {
            results.push({
              member: member.name,
              day: parseInt(day),
              timestamp: stars["1"].get_star_ts,
              starType: "⭐",
              speed: stars["2"] 
                ? (stars["2"].get_star_ts - stars["1"].get_star_ts) / 60
                : 0,
            });
          }
          if (stars["2"]) {
            results.push({
              member: member.name,
              day: parseInt(day),
              timestamp: stars["2"].get_star_ts,
              starType: "⭐⭐",
              speed: (stars["2"].get_star_ts - stars["1"].get_star_ts) / 60,
            });
          }
          return results;
        })
      );
  }, [data, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Completion Timeline</CardTitle>
        <CardDescription>
          Bubble size represents time between stars
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
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis
                dataKey="day"
                type="number"
                domain={[1, 25]}
                label={{ value: "Day", position: "bottom" }}
              />
              <YAxis
                dataKey="timestamp"
                domain={["auto", "auto"]}
                tickFormatter={(value) => new Date(value * 1000).toLocaleDateString()}
                label={{ value: "Completion Date", angle: -90, position: "insideLeft" }}
              />
              <ZAxis dataKey="speed" range={[50, 400]} />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === "timestamp") {
                    return new Date(value * 1000).toLocaleString();
                  }
                  return value;
                }}
              />
              <Legend />
              {Array.from(new Set(processedData.map((d) => d.member))).map(
                (member, index) => (
                  <Scatter
                    key={member}
                    name={member}
                    data={processedData.filter((d) => d.member === member)}
                    fill={`hsl(${(360 / processedData.length) * index}, 70%, 50%)`}
                  />
                )
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}