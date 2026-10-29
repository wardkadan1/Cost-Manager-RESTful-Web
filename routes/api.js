const express = require("express");
const router = express.Router();

const about = require("../controllers/about");
const costs = require("../controllers/costs");
const reports = require("../controllers/reports");
const users = require("../controllers/users");
const logs = require("../controllers/logs");
const requireLogsToken = require("../utils/requireLogsToken");

router.post("/add", costs.add);
router.get("/report", reports.getMonthlyReport);
router.get("/users", users.listUsers);
router.get("/users/:id", users.getUserDetails);
router.get("/logs", requireLogsToken, logs.listLogs);
router.get("/about", about.getTeam);

module.exports = router;
