// BEFORE (this wipes the suffix)
out.days = out.days.map((d, i) => ({
  ...d,
  title: `Day ${i + 1}`,
}));

// AFTER (keeps suffix like "Exploring Hong Kong")
out.days = out.days.map((d, i) => {
  const n = i + 1;
  const raw = (d.title || "").toString().trim();
  let suffix = "";
  const m = raw.match(/^ *Day\s*\d+\s*[:—-]?\s*(.*)$/i);
  if (m) {
    suffix = (m[1] || "").trim();
  } else if (raw) {
    suffix = raw;
  }
  return { ...d, title: suffix ? `Day ${n}: ${suffix}` : `Day ${n}` };
});
