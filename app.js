const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const pino = require("pino-http");

const logger = require("./logger");
const apiRoutes = require("./routes/api");
const persistLog = require("./middleware/persistLog");

dotenv.config();

const app = express();
app.use(express.json());
app.use(pino({ logger }));
app.use(persistLog());

mongoose
  .connect(process.env.DB_URL, { dbName: "cost_manager" })
  .then(() => logger.info("Mongo connected"))
  .catch((err) => {
    logger.error(err, "Mongo connect error");
    process.exit(1);
  });

app.use("/api", apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Cost Manager API on ${port}`));

module.exports = app;
