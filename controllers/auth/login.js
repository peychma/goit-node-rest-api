const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/user');
const { HttpError } = require('../../helpers/HttpError');
const { loginSchema } = require('../../schemas/schemas');

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
