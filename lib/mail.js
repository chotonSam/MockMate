import nodemailer from "nodemailer";

// Works with any SMTP service. Default settings are for Gmail (use an App Password).
//   SMTP_HOST=smtp.gmail.com  SMTP_PORT=465  SMTP_USER=you@gmail.com  SMTP_PASS=<16-char app password>
// To switch provider later (e.g. Brevo, Resend, Sendgrid) only these variables change.

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

let transporter;
export function getTransport() {
  if (!transporter) {
    const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
    const port = Number(process.env.SMTP_PORT || 465);
    const user = (process.env.SMTP_USER || "").trim();
    // Strip spaces if user pasted a 16-character Gmail App Password with spaces (e.g. 'abcd efgh ijkl mnop')
    const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");

    const isGmail = host === "smtp.gmail.com" || host.includes("gmail");

    if (isGmail) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
    } else {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
        auth: { user, pass },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      });
    }
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const user = (process.env.SMTP_USER || "").trim();
  const from = process.env.EMAIL_FROM || `MockMate <${user}>`;
  return getTransport().sendMail({ from, to, subject, text, html });
}

export async function verifySMTP() {
  if (!isMailConfigured()) return { ok: false, error: "SMTP is not configured in .env.local" };
  try {
    await getTransport().verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
