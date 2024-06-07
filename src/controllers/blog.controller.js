import DateTime from "../utils/DateTime.js";
import Header from "../utils/Header.js";
import BlogRepository from "../repositories/blog.repository.js";

export default class BlogController {
    static async getViewBlog(req, res) {
        const totalBlogPosts = await BlogRepository.getTotal();
        const blogPostsPerPage = 4;

        let page = req.params.page;

        if (!page) {
            page = 1;
        }

        const blog = await BlogRepository.getPostsByPageLimit(page, blogPostsPerPage);

        res.render("pages/blog/blog", {
            blog,
            user: SESSION_USER,
            blog_active: true,
            boostrapPaginator: BlogController.getRenderBootstrapPaginator(page, blogPostsPerPage, totalBlogPosts),
            header: Header.blog(),
        });
    }

    static async getSearchBlogTitle(req, res) {
        const blogPosts = await BlogRepository.getAll();
        const searchBlogTitle = req.query.blogTitle;

        if (!searchBlogTitle) {
            return res.redirect("/blog");
        }

        const blogTitlesSearched = blogPosts.filter(
            (blogPost) => blogPost.title.toLowerCase().indexOf(searchBlogTitle.toLowerCase()) > -1,
        );

        const totalBlogPostsFoundFromSearch = blogTitlesSearched.length;

        res.render("pages/blog/blog", {
            blog: blogTitlesSearched,
            searchBlogTitle,
            totalBlogPostsFoundFromSearch,
            header: Header.blog(),
        });
    }

    static fixComments(blogPost) {
        blogPost.comments = blogPost.comments.map((comment) => {
            if (SESSION_USER && comment.user_id == SESSION_USER.id) {
                comment.user_logged_can_delete = true;
            } else {
                comment.user_logged_can_delete = false;
            }
            return comment;
        });

        return blogPost;
    }

    static async getViewBlogPost(req, res) {
        const slug = req.params.slug;

        let blogPost = await BlogRepository.getBySlug(slug);

        if (blogPost.comments.length) {
            blogPost = await BlogController.fixComments(blogPost);

            if (blogPost.comments[0].comment_id < blogPost.comments[1].comment_id) blogPost.comments.reverse();
        }

        return res.render("pages/blog/blogPost", {
            user: SESSION_USER,
            blogPost,
            header: Header.blogPost(blogPost.title),
        });
    }

    static async postBlogComment(req, res) {
        const slug = req.params.slug;
        const { blog_comment } = req.body;

        const blogComment = {
            user_id: req.session.userID,
            user_logged_can_delete: true,
            user_name: SESSION_USER.name,
            user_avatar: SESSION_USER.avatar,
            comment: blog_comment,
            created_at: DateTime.getNow(),
        };

        const blogPost = await BlogRepository.createComment(slug, blogComment);

        if (!blogPost) {
            return res.redirect("/blog");
        }

        blogPost = await BlogController.fixComments(blogPost);

        req.flash("success", "Comment Created!");
        return res.redirect(`/blog/${slug}`);
    }

    static async getDeleteBlogCommentByCommentID(req, res) {
        const { slug, comment_id } = req.params;

        let blogPost = await BlogRepository.deleteCommentByCommentID(slug, comment_id);

        if (!blogPost) {
            return res.redirect(`/blog/${slug}`);
        }

        blogPost = await BlogController.fixComments(blogPost);

        req.flash("success", "Comment Deleted!");
        return res.redirect(`/blog/${slug}`);
    }
}
