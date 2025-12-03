import * as z from 'zod';

const EnvSchema = z.object({
  // AOC_SESSION_ID is now handled by the backend securely
  AOC_YEAR: z.string().default('2025'),
  AOC_LEADERBOARD_ID: z.string().default('1858329'),
});

const parseEnv = () => {
  const envVars: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(import.meta.env)) {
    if (key.startsWith('VITE_APP_')) {
      envVars[key.replace('VITE_APP_', '')] = value;
    }
  }

  const result = EnvSchema.safeParse(envVars);

  if (!result.success) {
    console.error('Environment validation failed:', result.error.flatten().fieldErrors);
    return {
      AOC_YEAR: '2025',
      AOC_LEADERBOARD_ID: '1858329',
    };
  }

  return result.data;
};

export const env = parseEnv();

// Derived config
export const AOC_API_PATH = `/api/${env.AOC_YEAR}/leaderboard/private/view/${env.AOC_LEADERBOARD_ID}.json`;
