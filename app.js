const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const pino = require("pino");
const pinoHttp = require("pino-http");

const Log = require("./models/Log");
const apiRoutes = require("./routes/api");

dotenv.config();

// base logger (Pino)
const baseLogger = pino({ level: process.env.LOG_LEVEL || "info" });

const app = express();
app.use(express.json());

// request logger (pino-http) using the base logger
app.use(pinoHttp({ logger: baseLogger }));

// persist each request to Mongo (logs collection)
app.use((req, res, next) => {
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
});

app.get("/", (req, res) => {
  res
    .status(200)
    .send("Cost Manager RESTful Web API is running. Try /api/about");
});

// routes
app.use("/api", apiRoutes);

// connect DB
mongoose
  .connect(process.env.DB_URL, { dbName: "cost_manager" })
  .then(() => baseLogger.info("Mongo connected"))
  .catch((err) => {
    baseLogger.error({ err }, "Mongo connect error");
    process.exit(1);
  });

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => baseLogger.info(`Cost Manager API on ${port}`));

module.exports = app;
