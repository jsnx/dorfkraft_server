const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

let transport;
if (process.env.NODE_ENV !== 'test') {
  transport = nodemailer.createTransport(config.email.smtp);
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
    html: html || text, // Fallback to text if HTML is not provided
  };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendWelcomeEmail = async (to, name) => {
  const subject = 'Willkommen bei DorfKraft!';
  const text = `Hallo ${name},\n\nWillkommen bei DorfKraft! Wir freuen uns, Sie an Bord zu haben.\n\nMit DorfKraft können Sie:\n- Ihre Routen effizient planen\n- Den Überblick über Ihre Fahrzeugflotte behalten\n- Verkäufe und Inventar verwalten\n- und vieles mehr!\n\nBei Fragen stehen wir Ihnen gerne zur Verfügung.\n\nBeste Grüße\nIhr DorfKraft Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://dorfkraft.com/logo.png" alt="DorfKraft Logo" style="max-width: 200px;">
      </div>
      
      <h1 style="color: #2C5282; text-align: center;">Willkommen bei DorfKraft!</h1>
      
      <p style="font-size: 16px; color: #2D3748;">Hallo ${name},</p>
      
      <p style="font-size: 16px; color: #2D3748;">Wir freuen uns, Sie an Bord zu haben!</p>
      
      <div style="background-color: #EBF8FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #2C5282; margin-bottom: 15px;">Mit DorfKraft können Sie:</h2>
        <ul style="color: #2D3748; list-style-type: none; padding: 0;">
          <li style="margin: 10px 0; padding-left: 25px; position: relative;">
            ✓ Ihre Routen effizient planen
          </li>
          <li style="margin: 10px 0; padding-left: 25px; position: relative;">
            ✓ Den Überblick über Ihre Fahrzeugflotte behalten
          </li>
          <li style="margin: 10px 0; padding-left: 25px; position: relative;">
            ✓ Verkäufe und Inventar verwalten
          </li>
          <li style="margin: 10px 0; padding-left: 25px; position: relative;">
            ✓ und vieles mehr!
          </li>
        </ul>
      </div>
      
      <p style="font-size: 16px; color: #2D3748;">Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        <p style="color: #2D3748; margin: 0;">Beste Grüße,</p>
        <p style="color: #2C5282; font-weight: bold; margin: 5px 0;">Ihr DorfKraft Team</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #718096;">
        <p>© 2024 DorfKraft. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  `;

  await sendEmail(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
};
