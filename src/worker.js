const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" }
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return json({ ok: true, app: "HUELLA", environment: env.ENVIRONMENT || "production", databaseConfigured: Boolean(env.DB) });
    }
    if (url.pathname.startsWith("/api/")) return json({ error: "endpoint_not_implemented" }, 404);
    return env.ASSETS.fetch(request);
  }
};