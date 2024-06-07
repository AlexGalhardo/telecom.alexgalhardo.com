import express from "express";
const router = express.Router();

import AdminController from "../controllers/admin.controller.js";

const isAdmin = (req, res, next) => {
    if ((SESSION_USER && !SESSION_USER.admin) || !SESSION_USER) return res.redirect("/");
    next();
};

router
    .get("/", isAdmin, AdminController.getViewStatistics)

    .get("/create/blogPost", isAdmin, AdminController.getViewCreateBlogPost)
    .post("/create/blogPost", isAdmin, AdminController.postCreateBlogPost)

    .get("/update/blogPost/:blog_id", isAdmin, AdminController.getViewUpdateBlogPost)
    .post("/update/blogPost/:blog_id", isAdmin, AdminController.postUpdateBlogPost)

    .post("/delete/blogPost/:blog_id", isAdmin, AdminController.postDeleteBlogPost)

    .get("/clientes", isAdmin, AdminController.getViewCustomers)

    .get("/excel", isAdmin, AdminController.getViewAdminExcel)

    .get("/cliente/:customer_uuid", isAdmin, AdminController.getViewCustomer)
    .get("/clientes/search", isAdmin, AdminController.getSearchCustomerName)
    .get("/clientes/page/:page", isAdmin, AdminController.getViewCustomers);

export { router as adminRoutes };
