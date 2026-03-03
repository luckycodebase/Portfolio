/* globals process */
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    // Validate input
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Send email via Resend
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'luckykumar9295@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email sent successfully' })
    };
  } catch (error) {
    console.error('Resend error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to send email' })
    };
  }
}
