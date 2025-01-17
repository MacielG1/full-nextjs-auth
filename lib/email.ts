import { Resend } from 'resend';

const resend = new Resend(process.env.RESNED_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendEmailVerification(email: string, token: string) {
  const confirmLink = `${domain}/auth/verify-email?token=${token}`;

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

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password.</p>
      <a href="${resetLink}">Reset password</a>
    `,
  });
}

export async function sendTwoFactorTokenEmail(email: string, token: string) {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Two-factor authentication code',
    text: `Your two-factor authentication code is: ${token}`,
  });
}
