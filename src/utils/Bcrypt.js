import bcrypt from "bcryptjs";

export default class Bcrypt {
    static cryptPassword(password) {
        return bcrypt
            .genSalt(12)
            .then((salt) => bcrypt.hash(password, salt))
            .then((hash) => hash);
    }

    static comparePassword(password, hashPassword) {
        return bcrypt.compare(password, hashPassword).then((resp) => resp);
    }
}
