// src/features/analytics/components/time-bar-chart.tsx
import * as React from "react";
import {
  BarChart,
  Bar,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaderboardData } from "@/types/members";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function TimeBarChart({ data }: { data: LeaderboardData }) {
  const [selectedMember, setSelectedMember] = React.useState<string>("all");

  const processedData = React.useMemo(() => {
    const dayData = Array.from({ length: 25 }, (_, i) => ({
      day: i + 1,
      firstStar: 0,
      secondStar: 0,
    }));

    const members =
      selectedMember === "all"
        ? Object.values(data.members)
        : [data.members[selectedMember]];

    members.forEach((member) => {
      Object.entries(member.completion_day_level).forEach(([day, stars]) => {
        const dayIndex = parseInt(day) - 1;
        const firstStarTime = stars["1"]?.get_star_ts;
        const secondStarTime = stars["2"]?.get_star_ts;

        if (firstStarTime) {
          const dayStart = new Date(firstStarTime * 1000);
          dayStart.setHours(0, 0, 0, 0);
          const firstStarMinutes =
            (firstStarTime - dayStart.getTime() / 1000) / 60;
          dayData[dayIndex].firstStar += firstStarMinutes;
        }

        if (secondStarTime && firstStarTime) {
          const timeBetweenStars = (secondStarTime - firstStarTime) / 60;
          dayData[dayIndex].secondStar += timeBetweenStars;
        }
      });
    });

    if (selectedMember !== "all") {
      return dayData;
    }

    // Calculate averages for all members
    const totalMembers = Object.keys(data.members).length;
    return dayData.map((day) => ({
      ...day,
      firstStar: day.firstStar / totalMembers,
      secondStar: day.secondStar / totalMembers,
    }));
  }, [data, selectedMember]);

  const chartConfig = {
    firstStar: {
      label: "Time to First Star",
      color: "hsl(var(--chart-1))",
    },
    secondStar: {
      label: "Time to Second Star",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Completion Times</CardTitle>
        <CardDescription>
          Time taken to complete each star per day
        </CardDescription>
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members (Average)</SelectItem>
            {Object.values(data.members).map((member) => (
              <SelectItem key={member.id} value={member.id.toString()}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="h-full w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 30,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  label={{
                    value: "Time (minutes)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -20,
                  }}
                />
                <Tooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `Day ${value}`}
                    />
                  }
                />
                <Legend />
                <Bar
                  dataKey="firstStar"
                  stackId="a"
                  fill="var(--color-firstStar)"
                  name="Time to First Star"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="secondStar"
                  stackId="a"
                  fill="var(--color-secondStar)"
                  name="Time to Second Star"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
