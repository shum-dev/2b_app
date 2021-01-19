const { User } = require('../api/users.controller');

exports.loginRequired = async (req, res, next) => {
  try {
    const userJwt = req.get('Authorization').slice('Bearer '.length);
    const user = await User.decoded(userJwt);

    const { error } = user;
    if (error) {
      return next({ status: 401, message: 'Please log in first!' });
    }
    req.user = user;
    return next();
  } catch (err) {
    return next({ status: 401, message: 'Please log in first!' });
  }
};
