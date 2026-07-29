const DEFAULT_TARGET_URL = "https://oasis25-backend.onrender.com";
const TARGET_URL = process.env.PING_URL || DEFAULT_TARGET_URL;

export default async function handler(_req, res) {
  try {
    const response = await fetch(TARGET_URL, { method: "GET" });

    // Any HTTP response (even 401/404) means the server is awake.
    // We report the backend's status so the caller can see what's going on.
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "ok",
        target: TARGET_URL,
        backendStatus: response.status,
        alive: true,
      }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "error", message }));
  }
}
