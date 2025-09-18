import { sendEmail } from '../email';

export async function sendOrderConfirmationEmail(to: string) {
  return sendEmail({
    to,
    subject: 'Merci pour votre achat Senior Zen',
    html: `
      <h1>Merci pour votre achat !</h1>
      <p>Vos ebooks sont disponibles dans votre bibliothèque : <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://senior-zen.example'}/library">accéder à ma bibliothèque</a>.</p>
    `,
  });
}

export async function sendSubscriptionWelcomeEmail(to: string) {
  return sendEmail({
    to,
    subject: 'Bienvenue au Club Senior Zen',
    html: `
      <h1>Bienvenue !</h1>
      <p>Retrouvez votre masterclass du mois et les ebooks bonus dans votre espace membre.</p>
    `,
  });
}
