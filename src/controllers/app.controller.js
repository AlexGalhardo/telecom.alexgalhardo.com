import { validationResult } from "express-validator";
import NodeMailer from "../utils/NodeMailer.js";
import Header from "../utils/Header.js";
import DateTime from "../utils/DateTime.js";

export default class AppController {
    static async getViewHome(req, res) {
        return res.render("pages/home", {
            flash_success: req.flash("success"),
            flash_warning: req.flash("warning"),
            user: SESSION_USER,
            header: Header.home(),
        });
    }

    static async getViewContract(req, res) {
        return res.render("pages/contract", {});
    }

    static async getViewFrequentQuestions(req, res) {
        return res.render("pages/frequent-questions", {
            flash_success: req.flash("success"),
            flash_warning: req.flash("warning"),
            user: SESSION_USER,
            header: Header.frequentQuestions(),
        });
    }

    static async getViewPlan(req, res) {
        return res.render("pages/plan", {
            flash_success: req.flash("success"),
            flash_warning: req.flash("warning"),
            user: SESSION_USER,
            header: Header.plan("Plano 80 Mega - Agendar Vísita Técnica"),
        });
    }

    static async getViewWorkWithUs(req, res) {
        return res.render("pages/work-with-us", {
            flash_success: req.flash("success"),
            flash_warning: req.flash("warning"),
            user: SESSION_USER,
            header: Header.workWithUs(),
        });
    }

    static getViewContact(req, res) {
        res.render("pages/contact", {
            flash_success: req.flash("success"),
            flash_warning: req.flash("warning"),
            user: SESSION_USER,
            header: Header.contact(),
            captcha: res.recaptcha,
            csrfToken: req.csrfToken(),
        });
    }

    static async postContact(req, res) {
        try {
            const errors = validationResult(req);

            if (!req.recaptcha.error) {
                if (!errors.isEmpty()) {
                    req.flash("warning", `${errors.array()[0].msg}`);
                    return res.redirect("/contato");
                }
            } else {
                req.flash("warning", `Invalid Recaptcha!`);
                return res.redirect("/contato");
            }

            const { name, email, address, phone, subject, message } = req.body;

            const contactObject = {
                send_at: DateTime.getNow(),
                name,
                email,
                address,
                phone,
                subject,
                message,
            };

            await NodeMailer.sendContact(contactObject);

            req.flash("success", "Mensagem Enviada!");
            return res.redirect("/contato");
        } catch (error) {
            throw new Error(error);
        }
    }

    static getViewPrivacy(req, res) {
        return res.render("pages/privacy", {
            user: SESSION_USER,
            header: Header.privacy(),
        });
    }

    static getViewTerms(req, res) {
        return res.render("pages/terms", {
            user: SESSION_USER,
            header: Header.terms(),
        });
    }
}
