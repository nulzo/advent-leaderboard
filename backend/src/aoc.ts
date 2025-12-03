import axios from 'axios';
import { config } from './config';
import { aocCache } from './cache';

const client = axios.create({
  baseURL: config.aoc.baseUrl,
  headers: {
    'User-Agent': 'github.com/nulzo/advent-leaderboard by nulzo',
  },
});

export async function fetchAocData(path: string) {
  // Check cache first
  const cached = aocCache.get(path);
  if (cached) {
    console.log(`[CACHE HIT] ${path} (fetched at ${new Date(cached.fetchedAt).toISOString()})`);
    return {
      ...cached.data,
      _meta: {
        cached: true,
        last_fetched: cached.fetchedAt,
      }
    };
  }

  console.log(`[CACHE MISS] Fetching ${path}`);
  
  if (!config.aoc.sessionId) {
    throw new Error('AOC_SESSION_ID is not configured on the server');
  }

  try {
    const response = await client.get(path, {
      headers: {
        Cookie: `session=${config.aoc.sessionId}`,
      },
    });

    // Cache the successful response
    aocCache.set(path, response.data);
    
    return {
      ...response.data,
      _meta: {
        cached: false,
        last_fetched: Date.now(),
      }
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[AOC ERROR] ${error.response?.status} ${error.response?.statusText}`);
      throw new Error(error.response?.data || error.message);
    }
    throw error;
  }
}
