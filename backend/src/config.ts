import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  aoc: {
    sessionId: process.env.AOC_SESSION_ID,
    baseUrl: 'https://adventofcode.com',
  },
  cache: {
    ttl: 15 * 60, // 15 minutes in seconds
    checkPeriod: 600, // 10 minutes
  }
};

if (!config.aoc.sessionId) {
  console.warn('Warning: AOC_SESSION_ID is not set. API calls will likely fail.');
}

