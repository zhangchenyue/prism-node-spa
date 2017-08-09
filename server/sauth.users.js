var users = {};

class Users {

    static getUser(id) {
        try {
            return users[id];
        }
        catch (err) {
            console.log(err);
        }
        return null;
    }

    static setUser(user) {
        users[user.id] = user;
    }
}

module.exports = Users;