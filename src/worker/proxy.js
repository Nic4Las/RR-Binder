/*
 * Cloudflare Worker CORS Proxy
 * 
 * Usage: https://your-worker-name.your-username.workers.dev/?url=TARGET_URL
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response("Usage: ?url=https://target.com", { status: 400 });
    }

    // Security: Only allow RoyalRoad fiction URLs
    if (!targetUrl.includes("https://www.royalroad.com/fiction")) {
      return new Response("Forbidden", { status: 403 });
    }

    try {
      // Fetch the target URL
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });

      // Create a new response with the original body
      const newResponse = new Response(response.body, response);

      // Add CORS headers to allow access from ANYWHERE (or restrict to your domain)
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      newResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
      newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

      return newResponse;

    } catch (e) {
      return new Response("Error fetching: " + e.message, { status: 500 });
    }
  },
};