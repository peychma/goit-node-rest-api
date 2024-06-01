const { HttpError } = require('../../helpers/HttpError');

const currentUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw HttpError(401, 'Not authorized');
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = currentUser;
