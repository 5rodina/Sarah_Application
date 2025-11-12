import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'



export const sendEmails = async (email,otpCode) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rodinaaymen@gmail.com",
        pass: "ncupudlztxbxllvw"
      },
    });
  
    jwt.sign({ email }, 'koko', async (err) => {
        
        await transporter.sendMail({
          from: 'Careery <rodinaaymen@gmail.com>',
          subject: 'Confirmation mail',
          to: email,
          html: `<a href="http://localhost:3000/v">Click here to confirm , ur otp code ${otpCode}</a>`
        });
    
    });
  };
  