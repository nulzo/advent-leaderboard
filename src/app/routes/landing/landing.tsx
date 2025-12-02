import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";

export const LandingRoute = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(paths.app.root.getHref());
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Section - Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8 flex flex-col justify-center p-8 lg:p-24 border-r border-border"
        >
          <h1 className="text-6xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-8 uppercase">
            Advent<br />
            Of Code<br />
            <span className="text-muted-foreground">Leaderboard</span>
          </h1>
          
          <div className="max-w-xl space-y-8">
            <p className="text-xl lg:text-2xl font-medium leading-relaxed">
              A minimalist, data-driven visualization platform for your private leaderboard. 
              Analyze performance, track deltas, and visualize progress.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleStart}
                className="text-lg h-14 px-8 bg-foreground text-background hover:bg-foreground/90"
              >
                Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <a
                href="https://github.com/nulzo/advent-leaderboard"
                target="_blank"
                rel="noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg h-14 px-8 w-full"
                >
                  <Github className="mr-2 h-5 w-5" /> GitHub
                </Button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Abstract / Visual */}
        <div className="hidden lg:flex lg:col-span-4 bg-muted/30 relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-px opacity-20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="bg-foreground/10" />
            ))}
          </div>
          
          <motion.div
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{ 
              duration: 20, 
              ease: "linear", 
              repeat: Infinity 
            }}
            className="relative w-64 h-64 border border-foreground rounded-full flex items-center justify-center"
          >
             <div className="w-32 h-32 bg-foreground rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
