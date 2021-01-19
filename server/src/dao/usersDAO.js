const usersSeedFunc = require('../data_sample/users');

let users;
let sessions;

class UsersDAO {
  static async injectDB(conn) {
    if (users && sessions) {
      return;
    }
    try {
      users = await conn.db(process.env.DB_NAME).collection('users');
      sessions = await conn.db(process.env.DB_NAME).collection('sessions');

      const usersSeed = await usersSeedFunc();
      const deleteAllResult = await users.deleteMany({});
      console.log('Users Deletion: ', deleteAllResult.result);
      const seedingResult = await users.insertMany(usersSeed);
      console.log('Users seeds: ', seedingResult.result);
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static getUser(email) {
    return users.findOne({ email });
  }

  static async addUser(userInfo) {
    try {
      await users.insertOne({ ...userInfo }, { w: 'majority' });
      return { success: true };
    } catch (e) {
      if (String(e).startsWith('MongoError: E11000 duplicate key error')) {
        return { error: 'A user with the given email already exists.' };
      }
      console.error(`Error occurred while adding new user, ${e}.`);
      return { error: e };
    }
  }

  static async loginUser(email, jwt) {
    try {
      await sessions.updateOne(
        { user_id: email },
        { $set: { jwt } },
        { upsert: true },
      );
      return { success: true };
    } catch (e) {
      console.error(`Error occurred while logging in user, ${e}`);
      return { error: e };
    }
  }

  static async logoutUser(email) {
    try {
      await sessions.deleteOne({ user_id: email });
      return { success: true };
    } catch (e) {
      console.error(`Error occurred while logging out user, ${e}`);
      return { error: e };
    }
  }

  static getUserSession(email) {
    try {
      return sessions.findOne({ user_id: email });
    } catch (e) {
      console.error(`Error occurred while retrieving user session, ${e}`);
      return null;
    }
  }

  static async deleteUser(email) {
    try {
      await users.deleteOne({ email });
      await sessions.deleteOne({ user_id: email });
      if (!(await this.getUser(email)) && !(await this.getUserSession(email))) {
        return { success: true };
      }
      console.error('Deletion unsuccessful');
      return { error: 'Deletion unsuccessful' };
    } catch (e) {
      console.error(`Error occurred while deleting user, ${e}`);
      return { error: e };
    }
  }

  static async checkAdmin(email) {
    try {
      const { isAdmin } = await this.getUser(email);
      return isAdmin || false;
    } catch (e) {
      return { error: e };
    }
  }

  static async makeAdmin(email) {
    try {
      const updateResponse = users.updateOne(
        { email },
        { $set: { isAdmin: true } },
      );
      return updateResponse;
    } catch (e) {
      return { error: e };
    }
  }
}

module.exports = UsersDAO;
