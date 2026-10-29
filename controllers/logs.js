const serverError = require("../utils/serverError");
const Log = require("../models/Log");

exports.listLogs = async (req, res) => {
  try {
    const logs = await Log.find({}, { _id: 0 }).sort({ at: -1 }).limit(500);
    return res.json(logs);
  } catch (e) {
    return serverError(req, res, e);
  }
};
