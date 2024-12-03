// src/features/delta/components/time-comparison.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaderboardData } from "@/types/members";

export function TimeComparison({ data }: { data: LeaderboardData }) {
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
  const allMemberIds = Object.values(data.members).map(m => m.id.toString());

  // Determine active members for comparison
  const activeMembers = selectedMembers.length === 0 ? allMemberIds : selectedMembers;

  const processedData = React.useMemo(() => {
    const metrics = [
      "Average Time",
      "Fastest Solve",
      "Consistency",
      "Early Completion",
      "Two-Star Rate"
    ];

    return metrics.map(metric => {
      const metricData: Record<string, number> = {};
      
      activeMembers.forEach(memberId => {
        const member = data.members[memberId];
        if (!member) return;
        
        const completions = Object.values(member.completion_day_level);
        if (completions.length === 0) return;

        switch(metric) {
          case "Average Time":
            const times = completions
              .filter(day => day["1"] && day["2"])
              .map(day => (day["2"].get_star_ts - day["1"].get_star_ts) / 60);
            if (times.length > 0) {
              metricData[member.name] = times.reduce((a, b) => a + b, 0) / times.length;
            }
            break;
            
          case "Fastest Solve":
            const solves = completions
              .filter(day => day["1"] && day["2"])
              .map(day => (day["2"].get_star_ts - day["1"].get_star_ts) / 60);
            if (solves.length > 0) {
              metricData[member.name] = Math.min(...solves);
            }
            break;
            
          case "Consistency":
            const timeVariances = completions
              .filter(day => day["1"] && day["2"])
              .map(day => (day["2"].get_star_ts - day["1"].get_star_ts) / 60);
            if (timeVariances.length > 0) {
              const avg = timeVariances.reduce((a, b) => a + b, 0) / timeVariances.length;
              const variance = timeVariances.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / timeVariances.length;
              metricData[member.name] = 100 - Math.min(100, variance);
            }
            break;
            
          case "Early Completion":
            const earlyCompletions = completions
              .filter(day => day["1"] && day["2"])
              .filter(day => {
                const completionTime = new Date(day["2"].get_star_ts * 1000);
                return completionTime.getHours() < 12;
              }).length;
            if (completions.length > 0) {
              metricData[member.name] = (earlyCompletions / completions.length) * 100;
            }
            break;
            
          case "Two-Star Rate":
            const twoStars = completions.filter(day => day["1"] && day["2"]).length;
            if (completions.length > 0) {
              metricData[member.name] = (twoStars / completions.length) * 100;
            }
            break;
        }
      });

      return {
        metric,
        ...metricData
      };
    });
  }, [data, activeMembers]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Time Comparison</CardTitle>
        <CardDescription>
          Compare members across different time-based metrics
        </CardDescription>
        <Select 
          value={selectedMembers.length === 0 ? "all" : selectedMembers.join(",")}
          onValueChange={(value) => {
            if (value === "all") {
              setSelectedMembers([]);
            } else {
              setSelectedMembers(value.split(","));
            }
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select members" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            {Object.values(data.members)
              .filter(member => member.stars > 0) // Only show active members
              .map((member) => (
                <SelectItem 
                  key={member.id} 
                  value={member.id.toString()}
                >
                  {member.name}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={processedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              {activeMembers.map((memberId, index) => {
                const member = data.members[memberId];
                if (!member || Object.values(member.completion_day_level).length === 0) return null;
                return (
                  <Radar
                    key={memberId}
                    name={member.name}
                    dataKey={member.name}
                    stroke={`hsl(${(360 / activeMembers.length) * index}, 70%, 50%)`}
                    fill={`hsl(${(360 / activeMembers.length) * index}, 70%, 50%)`}
                    fillOpacity={0.2}
                  />
                );
              })}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}