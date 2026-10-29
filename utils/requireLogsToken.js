const crypto = require("crypto");

// Optional protection for GET /api/logs.
// When LOGS_ACCESS_TOKEN is set, callers must send
//   Authorization: Bearer <LOGS_ACCESS_TOKEN>
// When it is not set, the endpoint stays public (the original behaviour),
// so existing clients and graders keep working until the token is configured.
module.exports = function requireLogsToken(req, res, next) {
  const expected = process.env.LOGS_ACCESS_TOKEN;
  if (!expected) return next();

  const header = req.get("authorization") || "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  return next();
};
