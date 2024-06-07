import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const MailTrap = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
    },
});

export { MailTrap };
