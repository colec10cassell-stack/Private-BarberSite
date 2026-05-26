const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { service, name, email, phone, message, website } = req.body;

  // Honeypot check — bots fill this in, humans don't
  if (website) {
    return res.status(200).json({ message: 'Message sent successfully' });
  }

  try {
    await resend.emails.send({
      from: 'Private Barber <cole@private-barber.com>',
      to: 'cole@private-barber.com',
      subject: `New Inquiry — ${service} — ${name}`,
      html: `
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message || 'None'}</p>
      `
    });

    res.status(200).json({ message: 'Inquiry sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};
