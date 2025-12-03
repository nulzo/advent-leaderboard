import express from 'express';
import { config } from './config';
import { fetchAocData } from './aoc';

const app = express();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Proxy
// Matches /api/... and captures the rest
app.get('/api/*', async (req, res) => {
  try {
    // Extract the path meant for AOC
    // Request to localhost:3000/api/2025/... -> /2025/...
    const targetPath = req.path.replace(/^\/api/, '');
    
    if (!targetPath || targetPath === '/') {
      res.status(400).json({ error: 'Invalid path' });
      return;
    }

    // Basic security validation: ensure we only proxy to allowed paths
    // This prevents using the server as a generic open proxy to AOC
    const allowedPattern = /^\/\d{4}\/(leaderboard|day)\/.*$/;
    if (!allowedPattern.test(targetPath)) {
       console.warn(`Blocked request to invalid path: ${targetPath}`);
       res.status(403).json({ error: 'Path not allowed' });
       return;
    }

    const data = await fetchAocData(targetPath);
    res.json(data);
  } catch (error: any) {
    console.error('Request failed:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from AOC' });
  }
});

const server = app.listen(config.port, () => {
  console.log(`AOC Proxy Server running on port ${config.port}`);
  console.log(`Caching enabled: TTL=${config.cache.ttl}s`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});


