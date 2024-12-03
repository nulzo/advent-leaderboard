import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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

export function PointsChart({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    // Get all star completion timestamps
    const allEvents: { time: number; member: string; points: number }[] = [];

    Object.values(data.members).forEach((member) => {
      Object.values(member.completion_day_level).forEach((day) => {
        if (day["1"]) {
          allEvents.push({
            time: day["1"].get_star_ts,
            member: member.name,
            points: 1,
          });
        }
        if (day["2"]) {
          allEvents.push({
            time: day["2"].get_star_ts,
            member: member.name,
            points: 1,
          });
        }
      });
    });

    // Sort events chronologically
    allEvents.sort((a, b) => a.time - b.time);

    // Initialize member points
    const memberPoints: Record<string, number> = {};
    Object.values(data.members).forEach((member) => {
      memberPoints[member.name] = 0;
    });

    // Create data points including state at each star completion
    const chartData = allEvents.map((event) => {
      memberPoints[event.member] += event.points;
      return {
        timestamp: event.time,
        ...memberPoints,
      };
    });

    // Add starting point with everyone at 0
    return [
      {
        timestamp: allEvents[0]?.time - 1,
        ...Object.fromEntries(
          Object.values(data.members).map((m) => [m.name, 0])
        ),
      },
      ...chartData,
    ];
  }, [data]);

  const filteredMembers = React.useMemo(() => {
    return Object.values(data.members)
      .filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((member) => member.name);
  }, [data, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Progress</CardTitle>
        <CardDescription>
          Track total stars earned by each member over time
        </CardDescription>
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <div className="h-[600px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  return new Date(value * 1000).toLocaleString();
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, "auto"]}
                label={{
                  value: "Total Stars",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value * 1000).toLocaleString()
                }
              />
              <Legend />
              {filteredMembers.map((memberName, index) => (
                <Line
                  key={memberName}
                  type="monotone" // Changed from "stepAfter" to "monotone"
                  dataKey={memberName}
                  stroke={`hsl(${
                    (360 / filteredMembers.length) * index
                  }, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
