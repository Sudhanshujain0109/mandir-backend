const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook', etc.
    auth: {
      user: 'rohitpsaini005@gmail.com', // Your email address
      pass: 'ddom jwxa qsue qtvc', // Your email password
    },
  });

  

export const sendMail=(userdata:any,subject:string)=>{
    const mailOptions = {
        from: 'rohitpsaini005@gmail.com',
        to: userdata.email, // Recipient's email address
        subject: subject,
        html: `<html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Our Service</title>
        </head>
        <body>
            <p>Dear ${userdata.full_name},</p>
        
            <p>Welcome to Shree Mahaveer Jain Digambar Mandir! We are excited to have you as a member of our community.</p>
        
            <p>Your account has been created, and here are your login details:</p>
        
            <ul>
                <li><strong>Username:</strong> ${userdata.email}</li>
                <li><strong>Default Password:</strong> ${userdata.password}</li>
            </ul>
        
            <p>For security reasons, we recommend that you change your password immediately after logging in for the first time. Here's how you can do it:</p>
        
            <ol>
                <li>Visit our website at [Your Website URL].</li>
                <li>Click on the "Log In" button.</li>
                <li>Enter your username or email address and the default password provided in this email.</li>
                <li>Once logged in, go to your account settings or profile page.</li>
                <li>Choose the "Change Password" option.</li>
                <li>Follow the prompts to create a new, secure password.</li>
            </ol>
        
            <p>If you have any questions or encounter any issues, please feel free to contact our support team at [Support Email Address]. We are here to assist you!</p>
        
            <p>Thank you for choosing [Your Service Name]. We look forward to serving you!</p>
        
            <p>Best regards,</p>
            <p>The Sharee Mahaveer Jain Digambar Mandir Sameeti</p>
        </body>
        </html>
        `
      };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent successfully:', info.response);
        }
      });
}