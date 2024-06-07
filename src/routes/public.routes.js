import dotenv from "dotenv";
dotenv.config();

import { RecaptchaV3 } from "express-recaptcha";

const recaptcha = new RecaptchaV3(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, { callback: "cb" });

import csrf from "csurf";
const csrfProtection = csrf({ cookie: true });

import express from "express";
const router = express.Router();

import AppController from "../controllers/app.controller.js";
import BlogController from "../controllers/blog.controller.js";
import AuthController from "../controllers/auth.controller.js";

const userIsAuthenticated = (req, res, next) => {
    if (req.session.userID) {
        req.flash("warning", "Você precisa se deslogar primeiro");
        return res.redirect("/");
    }
    next();
};

router
    .get("/", AppController.getViewHome)

    .get("/contato", recaptcha.middleware.render, csrfProtection, AppController.getViewContact)
    .post("/contato", recaptcha.middleware.verify, csrfProtection, AppController.postContact)

    .get("/politica-de-privacidade", AppController.getViewPrivacy)
    .get("/termos-de-uso", AppController.getViewTerms)
    .get("/duvidas-frequentes", AppController.getViewFrequentQuestions)
    .get("/trabalhe-conosco", AppController.getViewWorkWithUs)

    .get("/plano", AppController.getViewPlan)

    .get("/blog", BlogController.getViewBlog)
    .get("/blog/search", BlogController.getSearchBlogTitle)
    .get("/blog/page/:page", BlogController.getViewBlog)

    .get("/blog/:slug", BlogController.getViewBlogPost)
    .post("/blog/:slug", BlogController.postBlogComment)

    .get("/blog/:slug/deleteComment/:comment_id", BlogController.getDeleteBlogCommentByCommentID)

    .get("/newsletter-confirm-email", (req, res) => {
        req.flash("success", "Confirm your newsletter subscription by clicking in the link send to your email inbox!");
        return res.redirect("/");
    })
    .get("/newsletter-email-confirmed", (req, res) => {
        req.flash("success", "Your newsletter subscription was confirmed! Welcome aboard :D");
        return res.redirect("/");
    })

    .get("/login", userIsAuthenticated, recaptcha.middleware.render, csrfProtection, AuthController.getViewLogin)
    .post("/login", userIsAuthenticated, recaptcha.middleware.verify, csrfProtection, AuthController.postLogin)

    .get(
        "/criar-conta",
        userIsAuthenticated,
        recaptcha.middleware.render,
        csrfProtection,
        AuthController.getViewRegister,
    )
    .post("/criar-conta", userIsAuthenticated, recaptcha.middleware.verify, csrfProtection, AuthController.postRegister)

    .get("/esqueci-senha", userIsAuthenticated, AuthController.getViewForgetPassword)
    .post("/esqueci-senha", userIsAuthenticated, AuthController.postForgetPassword)

    .get("/confirmar-email/:email/:token", AuthController.verifyIfConfirmEmailURLIsValid)

    .get("/confirmar-email", AuthController.getViewResendConfirmEmailLink)
    .post("/confirmar-email", AuthController.postSendConfirmEmailLink)

    .get("/resetar-senha/:email/:token", userIsAuthenticated, AuthController.getViewResetPassword)
    .post("/resetar-senha", userIsAuthenticated, AuthController.postResetPassword);

export { router as publicRoutes };
