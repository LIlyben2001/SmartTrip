// /api/health.js  (CommonJS)
module.exports = (req, res) => {
  res.status(200).json({ ok: true, now: new Date().toISOString() });
};
