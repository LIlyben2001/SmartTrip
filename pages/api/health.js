// /pages/api/health.js (ES6 modules for Next.js)
export default function handler(req, res) {
  res.status(200).json({ 
    ok: true, 
    now: new Date().toISOString() 
  });
}
