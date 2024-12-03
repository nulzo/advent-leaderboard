import * as React from "react";
import {
  Sankey,
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
import { Input } from "@/components/ui/input";
import { LeaderboardData } from "@/types/members";

export function StarCompletionFlow({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    const nodes: { name: string }[] = [];
    const links: { source: number; target: number; value: number }[] = [];

    const filteredMembers = Object.values(data.members).filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create nodes for each day
    Array.from({ length: 25 }, (_, i) => {
      nodes.push({ name: `Day ${i + 1}` });
    });

    // Create links between consecutive days based on completions
    for (let i = 0; i < 24; i++) {
      const sourceDay = i + 1;
      const targetDay = i + 2;
      
      const completions = filteredMembers.filter(
        (member) =>
          member.completion_day_level[sourceDay]?.["2"] &&
          member.completion_day_level[targetDay]?.["1"]
      ).length;

      if (completions > 0) {
        links.push({
          source: i,
          target: i + 1,
          value: completions,
        });
      }
    }

    return { nodes, links };
  }, [data, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Completion Flow</CardTitle>
        <CardDescription>
          Visualize the flow of completions between days
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
            <Sankey
              data={processedData}
              nodeWidth={20}
              nodePadding={10}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              link={{ stroke: "hsl(var(--primary))" }}
            >
              <Tooltip />
            </Sankey>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}