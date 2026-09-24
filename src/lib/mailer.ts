import "server-only";
import nodemailer from "nodemailer";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendMail(opts: { subject: string; html: string; replyTo?: string }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, CONTACT_TO_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn(
      "[mailer] SMTP não configurado em .env.local — e-mail não enviado, apenas registrado no banco (leads).",
      { subject: opts.subject }
    );
    return { sent: false as const };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: CONTACT_TO_EMAIL || SMTP_USER,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
  });

  return { sent: true as const };
}
