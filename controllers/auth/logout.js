const User = require('../../model/user');
const { HttpError } = require('../../helpers/HttpError');

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      throw HttpError(401, 'Not authorized');
    }
    user.token = null;
    await user.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = logout;
