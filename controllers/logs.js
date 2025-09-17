const Log = require("../models/Log");

exports.listLogs = async (req, res) => {
  try {
    const logs = await Log.find({}, { _id: 0 }).sort({ at: -1 }).limit(500);
    return res.json(logs);
  } catch (e) {
    return res.status(500).json({ error: "server_error", details: e.message });
  }
};
