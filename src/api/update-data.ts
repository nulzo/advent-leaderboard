import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

const SESSION_COOKIE = process.env.AOC_SESSION_COOKIE;
const API_URL = 'https://adventofcode.com/2024/leaderboard/private/view/1858329.json';
const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'true-data.ts');

async function fetchLeaderboardData() {
  if (!SESSION_COOKIE) {
    throw new Error('AOC_SESSION_COOKIE environment variable is not set');
  }

  const response = await axios.get(API_URL, {
    headers: {
      Cookie: `session=${SESSION_COOKIE}`
    }
  });

  return response.data;
}

async function updateDataFile(newData: any) {
  const fileContent = `export const data = ${JSON.stringify(newData, null, 2)};`;
  await fs.writeFile(DATA_PATH, fileContent, 'utf-8');
  console.log('Data file updated successfully');
}

async function main() {
  try {
    const data = await fetchLeaderboardData();
    await updateDataFile(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating data:', error.response?.data || error.message);
    } else {
      console.error('Error updating data:', error);
    }
    process.exit(1);
  }
}

main();