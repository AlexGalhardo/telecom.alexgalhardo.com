import fs from "fs-extra";
import { v4 as uuid } from "uuid";
import randomToken from "rand-token";
import Bcrypt from "../utils/Bcrypt.js";
import DateTime from "../utils/DateTime.js";
import database from "../config/database.js";

export default class CustomersRepository {
    static save(database) {
        fs.writeFileSync(database, JSON.stringify(database, null, 2), (error) => {
            if (error) {
                throw new Error(error);
            }
        });
    }

    static getByCPF(customer_cpf) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (parseInt(database.customers[i].cpf) === parseInt(customer_cpf)) return database.customers[i];
            }
            return null;
        } catch (error) {
            throw new Error(error);
        }
    }

    static getAll() {
        try {
            return database.customers;
        } catch (error) {
            throw new Error(error);
        }
    }

    static getById(user_id) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].id == user_id) return database.customers[i];
            }
            return null;
        } catch (error) {
            throw new Error(error);
        }
    }

    static getUserByEmail(email) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].email == email) return database.customers[i];
            }
            return null;
        } catch (error) {
            throw new Error(error);
        }
    }

    static verifyIfAdminByID(user_id) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].id === user_id) {
                    if (database.customers[i].admin) return true;
                    return false;
                }
            }
            return false;
        } catch (error) {
            throw new Error(error);
        }
    }

    static emailRegistred(email) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].email === email) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async verifyConfirmEmailToken(email, token) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].email === email && database.customers[i].confirm_email_token === token) {
                    database.customers[i].confirmed_email = true;
                    database.customers[i].confirm_email_token = null;
                    await Users.save(database);
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async createConfirmEmailToken(email, confirmEmailToken) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].email === email) {
                    database.customers[i].confirm_email_token = confirmEmailToken;
                    await Users.save(database);
                    return;
                }
            }
            return;
        } catch (error) {
            throw new Error(error);
        }
    }

    static verifyIfEmailIsConfirmed(email) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].email == email && database.customers[i].confirmed_email) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async verifyLogin(email, password) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].email === email) {
                    const passwordValid = await Bcrypt.comparePassword(password, database.customers[i].password);
                    if (passwordValid) {
                        return database.customers[i];
                    }
                }
            }
            return null;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async verifyPassword(user_id, password) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].id === user_id) {
                    const passwordValid = await Bcrypt.comparePassword(password, database.customers[i].password);
                    if (passwordValid) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async create(userObject) {
        try {
            if (Users.emailRegistred(userObject.email)) return false;

            const passwordHash = await Bcrypt.cryptPassword(userObject.password);

            database.customers.push({
                id: uuid.v4(),
                name: userObject.username,
                email: userObject.email,
                confirmed_email: false,
                confirm_email_token: userObject.confirm_email_token,
                password: passwordHash,
                reset_password_token: null,
                admin: false,
                phone: {
                    number: null,
                    ddd: null,
                    country: null,
                },
                address: {
                    zipcode: null,
                    street: null,
                    street_number: null,
                    neighborhood: null,
                    city: null,
                    state: null,
                    country: null,
                },
                pagarme: {
                    customer_id: null,
                    card_id: null,
                    card_brand: null,
                    card_first_digits: null,
                    card_last_digits: null,
                    card_expiration_date: null,
                    currently_subscription_id: null,
                    currently_subscription_name: "FREE",
                    subscription_start: null,
                    subscription_end: null,
                },
                created_at: DateTime.getNow(),
                updated_at: DateTime.getNow(),
            });
            Users.save(database);
        } catch (error) {
            throw new Error(error);
        }
    }

    static async createResetPasswordToken(email) {
        try {
            const reset_password_token = await randomToken.generate(24);

            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].email === email) {
                    database.customers[i].reset_password_token = reset_password_token;
                    Users.save(database);
                    return;
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    static resetPasswordTokenIsValid(email, resetPasswordToken) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (
                    database.customers[i].email === email &&
                    database.customers[i].reset_password_token === resetPasswordToken
                ) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async resetPassword(email, newPassword) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].email === email) {
                    const passwordHash = await Bcrypt.cryptPassword(newPassword);
                    database.customers[i].password = passwordHash;
                    database.customers[i].reset_password_token = null;
                    Users.save(database, "error resetPassword: ");
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async update(userObject) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].id === SESSION_USER.id) {
                    const olderPasswordValid = await Bcrypt.comparePassword(
                        userObject.older_password,
                        database.customers[i].password,
                    );

                    if (olderPasswordValid) {
                        const passwordHash = await Bcrypt.cryptPassword(userObject.new_password);
                        database.customers[i].password = passwordHash;
                    }

                    // I need to refactor this shit code someday
                    if (userObject.name) database.customers[i].name = userObject.name;
                    if (userObject.new_email) database.customers[i].email = userObject.new_email;
                    if (userObject.document) database.customers[i].document = userObject.document;
                    if (userObject.phone) database.customers[i].phone = userObject.phone;
                    if (userObject.birthday) database.customers[i].birthday = userObject.birthday;
                    if (userObject.zipcode) database.customers[i].address.zipcode = userObject.zipcode;
                    if (userObject.street) database.customers[i].address.street = userObject.street;
                    if (userObject.street_number)
                        database.customers[i].address.street_number = userObject.street_number;
                    if (userObject.neighborhood) database.customers[i].address.neighborhood = userObject.neighborhood;
                    if (userObject.city) database.customers[i].address.city = userObject.city;
                    if (userObject.state) database.customers[i].address.state = userObject.state;
                    if (userObject.country) database.customers[i].address.country = userObject.country;

                    database.customers[i].updated_at = DateTime.getNow();

                    Users.save(database);

                    return;
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    static async delete(email, password) {
        try {
            for (let i = 0; i < database.customers.length; i++) {
                if (database.customers[i].email === email) {
                    const passwordValid = await Bcrypt.comparePassword(password, database.customers[i].password);
                    if (passwordValid) {
                        database.customers.splice(i, 1);
                        Users.save(database);
                        return;
                    }
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}
