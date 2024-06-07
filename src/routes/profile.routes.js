import csrf from "csurf";
const csrfProtection = csrf({ cookie: true });

import express from "express";
const router = express.Router();

import ProfileController from "../controllers/profile.controller.js";

const userIsAuthenticated = (req, res, next) => {
    if (!req.session.userID) {
        req.flash("warning", "Você precisa se logar primeiro");
        return res.redirect("/login");
    }
    next();
};

router
    .get("/", userIsAuthenticated, csrfProtection, ProfileController.getViewProfile)
    .post("/", userIsAuthenticated, csrfProtection, ProfileController.updateProfile)
    .get("/logout", userIsAuthenticated, ProfileController.getLogout);

export { router as profileRoutes };
