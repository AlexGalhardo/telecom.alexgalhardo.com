import pagination from "pagination";
import Blog from "../repositories/blog.repository.js";
import Header from "../utils/Header.js";

class AdminController {
    static getViewAdminExcel(req, res) {
        return res.render("pages/admin/excel", {
            user: SESSION_USER,
        });
    }

    static async getViewCustomers(req, res) {
        const customersPerPage = 10;

        let page = req.params.page;

        if (!page) {
            page = 1;
        }

        const customers = await Clientes.getCustomersByPageLimit(page, customersPerPage);
        const totalCustomers = await MKAuth.getTotalCustomers();

        return res.render("pages/admin/customers", {
            user: SESSION_USER,
            customers,
            totalCustomers,
            boostrapPaginator: AdminController.getRenderBootstrapPaginator(page, customersPerPage, totalCustomers),
        });
    }

    static async getSearchCustomerName(req, res) {
        const clientes = await Clientes.getAll();
        const searchCustomerName = req.query.customerName;

        if (!searchCustomerName) {
            return res.redirect("/admin/clientes");
        }

        const customersNameSearched = clientes.filter(
            (cliente) => cliente.nome.toLowerCase().indexOf(searchCustomerName.toLowerCase()) > -1,
        );

        const totalCustomersFoundFromSearch = customersNameSearched.length;

        const totalCustomers = await MKAuth.getTotalCustomers();

        res.render("pages/admin/customers", {
            user: SESSION_USER,
            searchCustomerName,
            totalCustomers,
            totalCustomersFoundFromSearch,
            customers: customersNameSearched,
        });
    }

    static getRenderBootstrapPaginator(current, blogPostsPerPage, totalBlogPosts, searchCustomerName) {
        let prelinkUrl = "/admin/clientes/";

        return new pagination.TemplatePaginator({
            prelink: prelinkUrl,
            current: current,
            rowsPerPage: blogPostsPerPage,
            totalResult: totalBlogPosts,
            slashSeparator: true,
            template: function (result) {
                var i, len, prelink;
                var html = '<div><ul class="pagination">';
                if (result.pageCount < 2) {
                    html += "</ul></div>";
                    return html;
                }
                prelink = this.preparePreLink(result.prelink);
                if (result.previous) {
                    html +=
                        '<li class="page-item"><a class="page-link" href="' +
                        prelink +
                        result.previous +
                        '">' +
                        this.options.translator("PREVIOUS") +
                        "</a></li>";
                }
                if (result.range.length) {
                    for (i = 0, len = result.range.length; i < len; i++) {
                        if (result.range[i] === result.current) {
                            html +=
                                '<li class="active page-item"><a class="page-link" href="' +
                                prelink +
                                result.range[i] +
                                '">' +
                                result.range[i] +
                                "</a></li>";
                        } else {
                            html +=
                                '<li class="page-item"><a class="page-link" href="' +
                                prelink +
                                result.range[i] +
                                '">' +
                                result.range[i] +
                                "</a></li>";
                        }
                    }
                }
                if (result.next) {
                    html +=
                        '<li class="page-item"><a class="page-link" href="' +
                        prelink +
                        result.next +
                        '" class="paginator-next">' +
                        this.options.translator("NEXT") +
                        "</a></li>";
                }
                html += "</ul></div>";
                return html;
            },
        }).render();
    }

    static async getViewCustomer(req, res) {
        const { customer_uuid } = req.params;

        const customer = await MKAuth.getCustomerByUUID(customer_uuid);

        if (!customer) {
            req.flash("warning", "Cliente não Encontrado");
            return res.redirect("/admin/clientes");
        }

        return res.render("pages/admin/customer", {
            user: SESSION_USER,
            customer,
        });
    }

    static getViewCreateBlogPost(req, res) {
        return res.render("pages/admin/createBlogPost", {
            user: SESSION_USER,
        });
    }

    static postCreateBlogPost(req, res) {
        const { blog_title, blog_category, blog_body } = req.body;

        const blogPostObject = {
            title: blog_title,
            category: blog_category,
            body: blog_body,
        };

        const blogPost = Blog.create(blogPostObject);

        if (!blogPost) {
            return res.render("pages/admin/createBlogPost", {
                flash: {
                    type: "warning",
                    message: "Error: blog post not created!",
                },
                user: SESSION_USER,
            });
        }

        return res.render(`pages/admin/updateBlogPost`, {
            flash: {
                type: "success",
                message: "Blog Post Created!",
            },
            blogPost,
            user: SESSION_USER,
        });
    }

    static getViewUpdateBlogPost(req, res) {
        const blog_id = req.params.blog_id;
        const blogPost = Blog.getByID(blog_id);

        res.render("pages/admin/updateBlogPost", {
            blogPost,
            user: SESSION_USER,
        });
    }

    static postUpdateBlogPost(req, res) {
        const { blog_id, blog_title, blog_resume, blog_image, blog_category, blog_body } = req.body;

        const blogPostObject = {
            id: parseInt(blog_id),
            title: blog_title,
            resume: blog_resume,
            image: blog_image,
            category: blog_category,
            body: blog_body,
            updated_at: null,
            comments: [],
        };

        const blogPost = Blog.update(blogPostObject);

        if (!blogPost) {
            return res.render("pages/admin/updateBlogPost", {
                flash: {
                    type: "warning",
                    message: "Error: blog post not updated!",
                },
                blogPost,
                user: SESSION_USER,
            });
        }

        return res.render("pages/admin/updateBlogPost", {
            flash: {
                type: "success",
                message: "Blog Post UPDATED!",
            },
            blogPost,
            user: SESSION_USER,
        });
    }

    static postDeleteBlogPost(req, res) {
        const blog_id = req.params.blog_id;

        if (Blog.delete(parseInt(blog_id))) {
            return res.redirect("/admin/create/blogPost");
        }
        return res.redirect(`/admin/update/blogPost/${blog_id}`);
    }

    static async getViewCreateCustomer(req, res) {
        return res.render("pages/admin/createCustomer", {
            user: SESSION_USER,
        });
    }

    static async getViewStatistics(req, res) {
        const statistics = await MKAuth.getStatistics();

        return res.render("pages/admin/statistics", {
            flash_success: req.flash("success"),
            flash_warning: req.flash("warning"),
            user: SESSION_USER,
            statistics,
            header: Header.adminHome(),
        });
    }
}

export default AdminController;
