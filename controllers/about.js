exports.getTeam = async (req, res) => {
  try {
    return res.json([
      { first_name: "Ward", last_name: "Keadan" },
      { first_name: "Shafir", last_name: "Hafif" },
    ]);
  } catch (e) {
    return res.status(500).json({ error: "server_error", details: e.message });
  }
};
