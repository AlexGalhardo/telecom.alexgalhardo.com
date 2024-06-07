import { validationResult } from "express-validator";
import NodeMailer from "../utils/NodeMailer.js";
import Customers from "../repositories/customers.repository.js";

class AuthController {
    static async getViewLogin(req, res) {
        return res.render("pages/auth/login", {
            flash_success: req.flash("success"),
            flash_warning: req.flash("warning"),
            captcha: res.recaptcha,
            csrfToken: req.csrfToken(),
        });
    }

    static async postLogin(req, res) {
        try {
            const errors = validationResult(req);

            if (!req.recaptcha.error) {
                if (!errors.isEmpty()) {
                    req.flash("warning", `${errors.array()}`);
                    return res.redirect("/login");
                }
            } else {
                req.flash("warning", `Recaptcha inválido!`);
                return res.redirect("/login");
            }

            const { email, password } = req.body;

            const userObject = await Customers.verifyLogin(email, password);

            if (!userObject) {
                req.flash("warning", `Email ou senha inválidos!`);
                return res.redirect("/login");
            }

            req.session.userID = userObject.id;
            global.SESSION_USER = userObject;
            req.flash("success", `Bem vindo de volta, ${global.SESSION_USER.name} :D`);

            if (SESSION_USER.admin) return res.redirect("/admin");

            return res.redirect("/profile");
        } catch (error) {
            throw new Error(error);
        }
    }

    static getViewRegister(req, res) {
        return res.render("pages/auth/register", {
            captcha: res.recaptcha,
            flash_success: req.flash("success"),
            flash_warning: req.flash("warning"),
            csrfToken: req.csrfToken(),
            app_url: process.env.APP_URL,
        });
    }

    static async verifyIfConfirmEmailURLIsValid(req, res) {
        const { email, token } = req.params;

        const confirmEmailValid = await Customers.verifyConfirmEmailToken(email, token);

        if (confirmEmailValid) {
            req.flash("success", "Email confirmado!");
            return res.redirect("/login");
        }

        return res.redirect("/login");
    }

    static async postRegister(req, res, next) {
        try {
            if (!req.recaptcha.error) {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    req.flash("warning", errors.array()[0].msg);
                    return res.redirect("/criar-conta");
                }
            } else {
                req.flash("warning", "Recaptcha inválido!");
                return res.redirect("/criar-conta");
            }

            const { username, email, password } = req.body;

            const userObject = {
                username,
                email,
                password,
            };

            const userCreated = await Customers.create(userObject);

            if (userCreated) {
                await NodeMailer.sendConfirmEmailLink(email);

                req.flash("success", "Conta criada! Confirme seu email clicando no link enviado para o seu inbox!");
                return res.redirect("/criar-conta");
            }

            req.flash("warning", "Algum erro aconteceu");
            return res.redirect("/criar-conta");
        } catch (error) {
            throw new Error(error);
        }
    }

    static getViewForgetPassword(req, res) {
        return res.render("pages/auth/forgetPassword");
    }

    static async postForgetPassword(req, res) {
        const { email } = req.body;

        await Customers.createResetPasswordToken(email);
        await NodeMailer.sendForgetPasswordLink(email);

        req.flash("success", `Se esse email existe, vamos enviar um link no seu inbox para você recuperar sua senha!`);
        return res.redirect("/esqueci-senha");
    }

    static getViewResetPassword(req, res) {
        const { email, token } = req.params;

        if (!email || !token) {
            return res.redirect("/forgetPassword");
        }

        if (!Customers.resetPasswordTokenIsValid(email, token)) {
            return res.redirect("/forgetPassword");
        }

        return res.render("pages/auth/resetPassword", {
            email,
        });
    }

    static postResetPassword(req, res) {
        const { email, new_password } = req.body;

        if (!Customers.resetPassword(email, new_password)) {
            return res.redirect("/forgetPassword");
        }

        req.flash("success", "Você atualizou sua senha!");
        return res.redirect("/login");
    }

    static getViewResendConfirmEmailLink(req, res) {
        return res.render("pages/auth/confirmEmail", {
            flash_success: req.flash("success"),
        });
    }

    static async postSendConfirmEmailLink(req, res) {
        const { email } = req.body;

        const emailConfirmed = await Customers.verifyIfEmailIsConfirmed(email);

        if (!emailConfirmed) {
            await NodeMailer.sendConfirmEmailLink(email);
        }

        req.flash(
            "success",
            "Se esse email esta registrado e não confirmado ainda, enviaremos um link no seu inbox para confirmar seu email!",
        );
        return res.redirect("/confirmEmail");
    }
}

export default AuthController;
