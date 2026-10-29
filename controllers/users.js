const serverError = require("../utils/serverError");
const User = require("../models/User");
const Cost = require("../models/Cost");

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { _id: 0, id: 1, first_name: 1, last_name: 1, birthday: 1 }
    );
    return res.json(users);
  } catch (e) {
    return serverError(req, res, e);
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ error: "user_not_found" });

    const totals = await Cost.aggregate([
      { $match: { userid: id } },
      { $group: { _id: null, t: { $sum: "$sum" } } },
    ]);
    const total = totals.length ? totals[0].t : 0;

    return res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total,
    });
  } catch (e) {
    return serverError(req, res, e);
  }
};
