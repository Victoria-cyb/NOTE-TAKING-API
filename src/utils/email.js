const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendReminderEmail = async (user) => {
    console.log('Sending email to user:', { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName });
  if (!user.firstName) {
    console.warn('User firstName is undefined, using fallback');
    user.firstName = 'User'; // Fallback to avoid undefined
  }
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MemoSphere Reminder</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #87CEEB;
          padding: 20px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          color: #333333;
        }
        .content p {
          font-size: 16px;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          background-color: #87CEEB;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #666666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MemoSphere</h1>
        </div>
        <div class="content">
          <p>Hi ${user.firstName},</p>
          <p>Don't forget to check your notes in MemoSphere today! Stay organized and keep your ideas flowing.</p>
          <a href="http://localhost:4000/" class="button">View Your Notes</a>
        </div>
        <div class="footer">
          <p>&copy; 2025 MemoSphere. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'MemoSphere Daily Notes Reminder',
    html: htmlContent,
  });
};