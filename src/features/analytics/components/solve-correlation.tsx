import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardData } from "@/types/members";

export function SolveCorrelation({ data }: { data: LeaderboardData }) {
  const processedData = React.useMemo(() => 
    Object.values(data.members)
      .filter(m => m.stars > 0 && m.avgSolveTime)
      .map(member => ({
        name: member.name,
        avgSolveTime: member.avgSolveTime,
        localScore: member.local_score,
        stars: member.stars,
      }))
  , [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solve Time vs. Score Correlation</CardTitle>
        <CardDescription>
          Exploring the relationship between solving speed and points earned
          (bubble size represents total stars)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="avgSolveTime"
                name="Average Solve Time"
                unit=" min"
                label={{
                  value: "Average Solve Time (minutes)",
                  position: "bottom",
                }}
              />
              <YAxis
                type="number"
                dataKey="localScore"
                name="Local Score"
                label={{
                  value: "Local Score",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ZAxis
                type="number"
                dataKey="stars"
                range={[50, 400]}
                name="Stars"
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter
                name="Members"
                data={processedData}
                fill="hsl(var(--primary))"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}