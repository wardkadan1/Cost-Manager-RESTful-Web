const Report = require("../models/Report");
const Cost = require("../models/Cost");

const CATS = ["food", "education", "health", "housing", "sports"];

function groupCosts(costs) {
  const map = Object.fromEntries(CATS.map((c) => [c, []]));
  for (const c of costs) {
    map[c.category].push({
      sum: Number(c.sum),
      description: c.description,
      day: c.day,
    });
  }
  return CATS.map((c) => ({ [c]: map[c] }));
}
function isPastMonth(year, month) {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  return year < y || (year === y && month < m);
}

exports.getMonthlyReport = async (req, res) => {
  try {
    const id = Number(req.query.id);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (
      !Number.isFinite(id) ||
      !Number.isFinite(year) ||
      !Number.isFinite(month)
    ) {
      return res.status(400).json({ error: "missing_or_invalid_query_params" });
    }
    if (month < 1 || month > 12) {
      return res.status(400).json({ error: "invalid_month" });
    }

    // check if we already have this report saved for past months
    if (isPastMonth(year, month)) {
      const cached = await Report.findOne({ userid: id, year, month });
      if (cached)
        return res.json({ userid: id, year, month, costs: cached.costs });
    }

    const items = await Cost.find({ userid: id, year, month }).lean();
    items.sort((a, b) => a.day - b.day);
    const grouped = groupCosts(items);

    // save the report so we dont have to calculate it again
    if (isPastMonth(year, month)) {
      await Report.findOneAndUpdate(
        { userid: id, year, month },
        { userid: id, year, month, costs: grouped, computedAt: new Date() },
        { upsert: true }
      );
    }
    return res.json({ userid: id, year, month, costs: grouped });
  } catch (e) {
    return res.status(500).json({ error: "server_error", details: e.message });
  }
};
