export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { email } = req.body;
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  
  // For now, just return success
  // Later you can integrate with email service like Mailchimp, ConvertKit, etc.
  return res.status(200).json({ message: 'Email subscribed successfully' });
}
