const scroll_bar_div = `
            <div class="progress-container">
                <div class="progress-bar" id="scroll_bar" style="background-color: #9309AF;"></div>
            </div>`;

const scroll_bar_script = `<script src="scripts/scroll_bar.js"></script>`;

class Header {
    static home() {
        return {
            title: "Galhardo Telecom - Internet Fibra Óptica",
            scroll_bar_div,
            scroll_bar_script,
        };
    }

    static privacy() {
        return {
            title: "Política de Privacidade - Galhardo Telecom",
            navbar_privacy_active: true,
            scroll_bar_div,
            scroll_bar_script,
        };
    }

    static terms() {
        return {
            title: "Termos de Uso - Galhardo Telecom",
            navbar_privacy_active: true,
            scroll_bar_div,
            scroll_bar_script,
        };
    }

    static frequentQuestions() {
        return {
            title: "Dúvidas Frequentes - Galhardo Telecom",
            navbar_doubts_active: true,
            scroll_bar_div,
            scroll_bar_script,
        };
    }

    static blog() {
        return {
            title: "Blog Galhardo Telecom",
            navbar_blog_active: true,
            scroll_bar_div,
            scroll_bar_script,
        };
    }

    static blogPost(blogPostTitle) {
        return {
            title: blogPostTitle,
            navbar_blog_active: true,
            scroll_bar_div,
            scroll_bar_script: `<script src="../scripts/scroll_bar.js"></script>`,
            use_disqus: true,
            disqus_comments: `<div id="disqus_thread"></div>
                <script>
                    (function() { // DON'T EDIT BELOW THIS LINE
                    var d = document, s = d.createElement('script');
                    s.src = 'https://apollo-telecom.disqus.com/embed.js';
                    s.setAttribute('data-timestamp', +new Date());
                    (d.head || d.body).appendChild(s);
                    })();
                </script>
                <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>`,
            disqus_script: `<script id="dsq-count-scr" src="//apollo-telecom.disqus.com/count.js" async></script>`,
            share_buttons_script: `<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5b07de0e9307065b"></script>`,
            share_buttons_inline: `<div class="addthis_inline_share_toolbox"></div>`,
        };
    }

    static contact() {
        return {
            title: "Contato - Galhardo Telecom",
            navbar_contact_active: true,
            scroll_bar_div,
            scroll_bar_script,
        };
    }

    static profile(head_title) {
        return {
            title: head_title,
            scroll_bar_div,
            scroll_bar_script,
        };
    }

    static workWithUs() {
        return {
            title: "Trabalhe Conosco - Galhardo Telecom",
            scroll_bar_div,
            scroll_bar_script,
        };
    }

    static adminHome() {
        return {
            title: "ADMIN Home",
            scroll_bar_div,
            scroll_bar_script,
        };
    }
}

export default Header;
