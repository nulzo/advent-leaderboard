import { StarCompletionBubbles } from "@/features/stars/components/star-completion-bubbles";
import { StarCompletionSunburst } from "@/features/stars/components/star-completion-sunburst";
import { StarVelocityChart } from "@/features/stars/components/star-velocity-chart";
import { StarStreakCalendar } from "@/features/stars/components/star-streak-calendar";
import { StarCompletionFlow } from "@/features/stars/components/star-completion-flow";
import { data } from "@/data/true-data";

export function StarsRoute() {
  return (
    <div className="space-y-8">
      <h1 className="font-bold text-4xl">Star Completion Analysis</h1>
      <StarCompletionBubbles data={data} />
      <StarCompletionSunburst data={data} />
      <StarVelocityChart data={data} />
      <StarStreakCalendar data={data} />
      <StarCompletionFlow data={data} />
    </div>
  );
}