import handlebars from "handlebars";
import fs from "fs-extra";
import path from "path";
import DateTime from "./DateTime.js";
import { MailTrap } from "../config/smtp.js";

class NodeMailer {
    static async sendContact(contactObject) {
        const filePath = path.join(__dirname, "/views/emails/contact.html");

        const source = fs.readFileSync(filePath, "utf-8").toString();

        const template = handlebars.compile(source);

        const replacements = {
            send_at: DateTime.getNow(),
            name: contactObject.name,
            email: contactObject.email,
            address: contactObject.address,
            phone: contactObject.phone,
            subject: contactObject.subject,
            message: contactObject.message,
        };

        const htmlBody = template(replacements);

        await MailTrap.sendMail({
            from: contactObject.email,
            to: process.env.APP_EMAIL,
            subject: `Contato Galhardo Telecom: ${contactObject.subject} do cliente ${contactObject.name}`,
            text: contactObject.subject,
            html: htmlBody,
        });

        MailTrap.close();
    }

    static async sendForgetPasswordLink(email, reset_password_token) {
        const resetPasswordLinkURL = `${process.env.APP_URL}/resetPassword/${email}/${reset_password_token}`;

        const filePath = path.join(__dirname, "/views/emails/forget_password.html");

        const source = fs.readFileSync(filePath, "utf-8").toString();

        const template = handlebars.compile(source);

        const replacements = {
            resetPasswordLinkURL,
        };

        const htmlBody = template(replacements);

        await MailTrap.sendMail({
            from: process.env.APP_EMAIL,
            to: email,
            subject: `GALHARDO APP: Recover Your Password!`,
            html: htmlBody,
        });

        MailTrap.close();
    }
}

export default NodeMailer;
