const Log = require("../models/Log");

module.exports = function persistLog() {
  return (req, res, next) => {
    res.on("finish", () => {
      const row = new Log({
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        msg: "endpoint_access",
        at: new Date(),
      });
      row.save().catch(() => {});
    });
    next();
  };
};
