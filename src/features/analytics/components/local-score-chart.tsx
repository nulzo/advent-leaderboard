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

export function LocalScoreChart({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    // Get all completion events with local scores
    const allEvents: { time: number; member: string; score: number }[] = [];

    Object.values(data.members).forEach((member) => {
      // Skip members with no score
      if (member.local_score === 0) return;

      // For each member, create an event at their last star timestamp
      allEvents.push({
        time: member.last_star_ts,
        member: member.name,
        score: member.local_score,
      });
    });

    // Sort events chronologically
    allEvents.sort((a, b) => a.time - b.time);

    // Initialize member scores
    const memberScores: Record<string, number> = {};
    Object.values(data.members).forEach((member) => {
      memberScores[member.name] = 0;
    });

    // Create data points including state at each score update
    const chartData = allEvents.map((event) => {
      memberScores[event.member] = event.score;
      return {
        timestamp: event.time,
        ...memberScores,
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
        <CardTitle>Local Score Progress</CardTitle>
        <CardDescription>
          Track local score progression for each member over time
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
                  value: "Local Score",
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
                  type="monotone"
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