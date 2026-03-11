import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    } : undefined
});

await transporter.verify();

function createEmail(subject, primary, secondary, main) {
  return (
    `<div style="
      font-family: monospace;
      max-width: 500px; 
      margin: auto; 
      background-color: #2C2E3E; 
      padding: 10px;">
      <h1 style="text-align: center; color: whitesmoke;">MaxxedOut</h1>
      <hr>
      <div style="background-color: whitesmoke; padding: 10px">
        <h2 style="text-align: center;">${subject}</h2>
        <hr>
        <p>${primary}</p>
        <div style="
          margin: auto; 
          width: 50%; 
          background-color: white; 
          padding: 20px; 
          text-align: center;
          border-radius: 10px;">
          <h1>${main}</h1>
        </div>
        <p>${secondary}</p>
        <hr>
        <h3 style="text-align: center;">2026 © MaxxedOut</h3>
      </div>
    </div>`
  )
}

export {transporter, createEmail};