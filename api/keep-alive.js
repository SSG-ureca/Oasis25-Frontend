import axios from 'axios';

const DEFAULT_TARGET_URL = 'https://oasis25-backend.onrender.com';
const TARGET_URL = process.env.PING_URL || DEFAULT_TARGET_URL;

export default async function handler(_req, res) {
  try {
    const response = await axios.get(TARGET_URL, { timeout: 10000 });

    if (response.status >= 200 && response.status < 300) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'ok', target: TARGET_URL }));
      return;
    }

    throw new Error(`Ping failed: ${response.status}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'error', message }));
  }
}
