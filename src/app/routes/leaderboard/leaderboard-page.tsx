import { LeaderboardOverview } from "@/features/overview/components/overview";
import { data } from "@/data/true-data";

export function LeaderboardRoute() {
  return (
    <div className="mx-auto px-4 py-12 font-sans container">
      {/* Header Section */}
      <header className="border-foreground mb-16 pb-8 border-b-4">
        <h1 className="mb-6 font-bold font-sans text-5xl md:text-7xl">Competition Analysis</h1>
        <p className="max-w-3xl text-lg md:text-xl leading-relaxed">
          Statistical overview and performance metrics of participant progress in algorithmic challenges.
        </p>
      </header>

      {/* Main Content */}
      <div className="space-y-24">
        {/* Overview Section */}
        <section>
          <LeaderboardOverview data={data} />
        </section>

        {/* Methodology Footer */}
        <footer className="border-foreground mt-16 pt-8 border-t-2">
          <h3 className="mb-4 font-bold text-xl">Methodology</h3>
          <p className="max-w-3xl text-lg leading-relaxed">
            Analysis based on real-time competition data. Metrics include completion times, 
            star achievements, and relative performance rankings.
          </p>
        </footer>
      </div>
    </div>
  );
}