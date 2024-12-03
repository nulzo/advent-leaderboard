import * as React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
import { LeaderboardData } from "@/types/members";

export function PerformanceRadar({ data }: { data: LeaderboardData }) {
  const processedData = React.useMemo(() => {
    const members = Object.values(data.members).filter(m => m.stars > 0);
    const maxStars = Math.max(...members.map(m => m.stars));
    const maxScore = Math.max(...members.map(m => m.local_score));
    const maxSolveTime = Math.max(...members.map(m => m.avgSolveTime || 0));

    return members.map(member => ({
      name: member.name,
      "Star Completion": (member.stars / maxStars) * 100,
      "Local Score": (member.local_score / maxScore) * 100,
      "Solve Speed": 100 - ((member.avgSolveTime || 0) / maxSolveTime) * 100,
      "Consistency": (Object.keys(member.completion_day_level).length / 25) * 100,
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Performance Radar</CardTitle>
        <CardDescription>
          Comparing members across different performance metrics (normalized to percentages)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={150} data={processedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              {["Star Completion", "Local Score", "Solve Speed", "Consistency"].map(
                (dataKey, index) => (
                  <Radar
                    key={dataKey}
                    name={dataKey}
                    dataKey={dataKey}
                    stroke={`hsl(${(360 / 4) * index}, 70%, 50%)`}
                    fill={`hsl(${(360 / 4) * index}, 70%, 50%)`}
                    fillOpacity={0.2}
                  />
                )
              )}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}