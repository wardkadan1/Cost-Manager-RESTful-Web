const User = require("../models/User");
const Cost = require("../models/Cost");

function todayYMD() {
  const now = new Date();
  return {
    y: now.getUTCFullYear(),
    m: now.getUTCMonth() + 1,
    d: now.getUTCDate(),
  };
}
function isPast(y, m, d) {
  const t = todayYMD();
  if (y < t.y) return true;
  if (y === t.y && m < t.m) return true;
  if (y === t.y && m === t.m && d < t.d) return true;
  return false;
}

exports.add = async (req, res) => {
  try {
    // ADD USER
    const { id, first_name, last_name, birthday } = req.body || {};
    if (id !== undefined && first_name && last_name && birthday) {
      const numId = Number(id);
      if (!Number.isFinite(numId))
        return res.status(400).json({ error: "invalid_id" });
      const exists = await User.findOne({ id: numId });
      if (exists) return res.status(400).json({ error: "user_already_exists" });

      const user = await User.create({
        id: numId,
        first_name,
        last_name,
        birthday,
      });
      return res.status(201).json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        birthday: user.birthday,
      });
    }

    // ADD COST
    const { description, category, userid, sum } = req.body || {};
    if (
      !description ||
      !category ||
      userid === undefined ||
      sum === undefined
    ) {
      return res.status(400).json({ error: "missing_fields" });
    }
    const numUser = Number(userid);
    const numSum = Number(sum);
    if (!Number.isFinite(numUser) || !Number.isFinite(numSum)) {
      return res.status(400).json({ error: "invalid_number" });
    }
    const u = await User.findOne({ id: numUser });
    if (!u) return res.status(404).json({ error: "user_not_found" });

    let { year, month, day } = req.body || {};
    if (!year || !month || !day) {
      const t = todayYMD();
      year = t.y;
      month = t.m;
      day = t.d;
    }
    const ny = Number(year),
      nm = Number(month),
      nd = Number(day);
    if (!Number.isFinite(ny) || !Number.isFinite(nm) || !Number.isFinite(nd)) {
      return res.status(400).json({ error: "invalid_date_numbers" });
    }

    if (isPast(ny, nm, nd)) {
      return res.status(400).json({ error: "past_date_not_allowed" });
    }

    const doc = await Cost.create({
      description,
      category,
      userid: numUser,
      sum: numSum,
      year: ny,
      month: nm,
      day: nd,
    });

    return res.status(201).json({
      description: doc.description,
      category: doc.category,
      userid: doc.userid,
      sum: Number(doc.sum),
      year: doc.year,
      month: doc.month,
      day: doc.day,
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "validation_error", details: e.message });
    }
    return res.status(500).json({ error: "server_error", details: e.message });
  }
};
