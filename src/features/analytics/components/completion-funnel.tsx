import * as React from "react";
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
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

export function CompletionFunnel({ data }: { data: LeaderboardData }) {
  const processedData = React.useMemo(() => {
    const totalMembers = Object.keys(data.members).length;
    const dayCompletions = Array.from({ length: 25 }, (_, i) => {
      const day = i + 1;
      const completions = Object.values(data.members).filter(
        m => m.completion_day_level[day]?.["2"]
      ).length;
      return {
        name: `Day ${day}`,
        value: (completions / totalMembers) * 100,
        fill: `hsl(${(360 / 25) * i}, 70%, 50%)`,
      };
    });

    return dayCompletions.sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Rate Funnel</CardTitle>
        <CardDescription>
          Showing the percentage of members who completed each day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip />
              <Funnel
                data={processedData}
                dataKey="value"
                nameKey="name"
                labelLine
              >
                <LabelList
                  position="right"
                  fill="#000"
                  stroke="none"
                  dataKey="name"
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}