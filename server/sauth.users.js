var users = {};

class Users {

    static getUser(email) {
        try {
            return users[email];
        }
        catch (err) {
            console.log(err);
        }
        return null;
    }

    static setUser(user) {
        users[user.Email] = user;
    }
}

module.exports = Users;