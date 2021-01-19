/* eslint-disable max-classes-per-file */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersDAO = require('../dao/usersDAO');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

class User {
  constructor({ email, password, isAdmin } = {}) {
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }

  toJson() {
    return { email: this.email, isAdmin: this.isAdmin };
  }

  async comparePassword(plainText) {
    const result = await bcrypt.compare(plainText, this.password);
    return result;
  }

  encoded() {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4, // 4 hour
        ...this.toJson(),
      },
      process.env.SECRET_KEY,
    );
  }

  static decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return { error };
      }
      return new User(res);
    });
  }
}

class UsersController {
  static async register(req, res) {
    try {
      const userFromBody = req.body;
      const errors = {};
      if (userFromBody && userFromBody.password.length < 8) {
        errors.password = 'Your password must be at least 8 characters.';
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password),
      };

      const insertResult = await UsersDAO.addUser(userInfo);
      if (!insertResult.success) {
        errors.email = insertResult.error;
      }
      const userFromDB = await UsersDAO.getUser(userFromBody.email);
      if (!userFromDB) {
        errors.general = 'Internal error, please try again later';
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const user = new User(userFromDB);

      res.json({
        authToken: user.encoded(),
        info: user.toJson(),
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'Bad email format, expected string.' });
        return;
      }
      if (!password || typeof password !== 'string') {
        res.status(400).json({ error: 'Bad password format, expected string.' });
        return;
      }
      const userData = await UsersDAO.getUser(email);
      if (!userData) {
        res.status(401).json({ error: 'Make sure your email is correct.' });
        return;
      }
      const user = new User(userData);

      if (!(await user.comparePassword(password))) {
        res.status(401).json({ error: 'Make sure your password is correct.' });
        return;
      }

      const loginResponse = await UsersDAO.loginUser(user.email, user.encoded());
      if (!loginResponse.success) {
        res.status(500).json({ error: loginResponse.error });
        return;
      }
      res.json({ authToken: user.encoded(), info: user.toJson() });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  static async logout(req, res) {
    try {
      const userJwt = req.get('Authorization').slice('Bearer '.length);
      const userObj = await User.decoded(userJwt);
      if (userObj.error) {
        res.status(401).json({ error: userObj.error });
        return;
      }
      const logoutResult = await UsersDAO.logoutUser(userObj.email);
      if (logoutResult.error) {
        res.status(500).json({ error: logoutResult.error });
        return;
      }
      res.json(logoutResult);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async delete(req, res) {
    try {
      const { password } = req.body;
      if (!password || typeof password !== 'string') {
        res.status(400).json({ error: 'Bad password format, expected string.' });
        return;
      }
      const userJwt = req.get('Authorization').slice('Bearer '.length);
      const userClaim = await User.decoded(userJwt);
      if (userClaim.error) {
        res.status(401).json({ error: userClaim.error });
        return;
      }
      const user = new User(await UsersDAO.getUser(userClaim.email));
      if (!(await user.comparePassword(password))) {
        res.status(401).json({ error: 'Make sure your password is correct.' });
        return;
      }
      const deleteResult = await UsersDAO.deleteUser(userClaim.email);

      if (deleteResult.error) {
        res.status(500).json({ error: deleteResult.error });
        return;
      }
      res.json(deleteResult);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = {
  User,
  UsersController,
};
