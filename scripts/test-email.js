const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Simple .env.local loader
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const user = (process.env.SMTP_USER || "").trim();
const rawPass = (process.env.SMTP_PASS || "").trim();
const pass = rawPass.replace(/\s+/g, "");
const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
const port = Number(process.env.SMTP_PORT || 465);

console.log("=========================================");
console.log("   MockMate SMTP Email Configuration Test");
console.log("=========================================");
console.log(`SMTP_HOST : ${host}`);
console.log(`SMTP_PORT : ${port}`);
console.log(`SMTP_USER : ${user ? user : "(NOT CONFIGURED - BLANK)"}`);
console.log(`SMTP_PASS : ${rawPass ? `${rawPass.slice(0, 4)}... (length: ${pass.length} chars)` : "(NOT CONFIGURED - BLANK)"}`);
console.log("-----------------------------------------");

if (!user || !pass) {
  console.log("❌ SMTP is not configured in .env.local.");
  console.log("\nTo send real verification emails to inboxes with Gmail:");
  console.log("1. Go to Google Account -> Security -> 2-Step Verification (turn on if off).");
  console.log("2. Scroll down to 'App Passwords' (search 'App Passwords' in Google Account).");
  console.log("3. Create an app password named 'MockMate' (generates a 16-character password).");
  console.log("4. In .env.local, set:");
  console.log("   SMTP_USER=your-email@gmail.com");
  console.log("   SMTP_PASS=your-16-character-app-password");
  console.log("   EMAIL_FROM=MockMate <your-email@gmail.com>");
  console.log("\nNote: In development mode, MockMate prints verification codes in the console");
  console.log("and displays them directly in the verification banner so you are never blocked!");
  process.exit(0);
}

const isGmail = host === "smtp.gmail.com" || host.includes("gmail");
const transporter = isGmail
  ? nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    })
  : nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

console.log("Testing SMTP connection...");
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error.message);
    if (error.code === "EAUTH") {
      console.error("\nTip: Gmail requires a 16-character 'App Password', not your personal Gmail login password.");
    }
  } else {
    console.log("✅ SMTP connection verified successfully! Server is ready to send emails.");
  }
});
