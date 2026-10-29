// Log the real error server-side and return a generic 500 body,
// so database/driver messages are never sent to API clients.
module.exports = function serverError(req, res, err) {
  const logger = req.log || console;
  logger.error({ err }, "unhandled_error");
  return res.status(500).json({ error: "server_error" });
};
