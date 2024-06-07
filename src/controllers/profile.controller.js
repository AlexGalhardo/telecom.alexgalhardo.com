import Header from "../utils/Header.js";
import CustomersRepository from "../repositories/customers.repository.js";

export default class ProfileController {
    static async getViewProfile(req, res) {
        return res.render("pages/profile/profile", {
            user: SESSION_USER,
            flash_success: req.flash("success"),
            flash_warning: req.flash("warning"),
            header: Header.profile("Meu Perfil - RecomendaÊ"),
            csrfToken: req.csrfToken(),
        });
    }

    static getLogout(req, res) {
        req.session.destroy((error) => {
            if (error) throw new Error(error);
        });
        SESSION_USER = null;
        return res.redirect("/login");
    }

    static async updateProfile(req, res) {
        const {
            username,
            email,
            document,
            phone,
            birth_date,
            older_password,
            new_password,
            zipcode,
            street,
            street_number,
            neighborhood,
            state,
            city,
            country,
        } = req.body;

        const userObject = {
            id: req.session.userID,
            username,
            email,
            document,
            phone,
            birth_date,
            older_password,
            new_password,
            zipcode,
            street,
            street_number,
            neighborhood,
            state,
            city,
            country,
        };

        await CustomersRepository.update(userObject);

        req.flash("success", "Profile Information Updated!");
        return res.redirect("/profile");
    }
}
