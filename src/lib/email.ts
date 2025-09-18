import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY ?? '');

export async function sendEmail(options: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_KEY) {
    console.warn('RESEND_KEY not configured, email not sent but logged to console.');
    console.log(options);
    return { id: 'test-email' };
  }

  return resend.emails.send({
    from: 'Senior Zen <bonjour@seniorzen.fr>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
