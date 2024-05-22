import { Resend } from 'resend';

const resend = new Resend(process.env.RESNED_API_KEY);

export async function sendEmailVerification(email: string, token: string) {
  const confirmLink = `http://localhost:3000/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your email',
    html: `
      <h1>Confirm your email</h1>
      <p>Click the link below to confirm your email address.</p>
      <a href="${confirmLink}">Confirm email</a>
    `,
  });
}
