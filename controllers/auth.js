const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { HttpError } = require("../helpers/HttpError");
const { loginSchema, registSchema } = require("../schemas/schemas");
const fs = require("fs").promises;
const path = require("path");
const Jimp = require("jimp");
const gravatar = require("gravatar");

const uploadAvatar = async (req, res, next) => {
  try {
    const { path: tempPath, filename } = req.file;
    const { _id: userId } = req.user;

    const image = await Jimp.read(tempPath);
    await image.resize(250, Jimp.AUTO).writeAsync(tempPath);

    const avatarsDir = path.join(__dirname, "../public/avatars");
    await fs.mkdir(avatarsDir, { recursive: true });
    const uniqueFilename = `${userId}-${filename}`;
    const finalPath = path.join(avatarsDir, uniqueFilename);

    await fs.rename(tempPath, finalPath);

    const avatarURL = `/avatars/${uniqueFilename}`;

    await User.findByIdAndUpdate(userId, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
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


const currentUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};


const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    user.token = null;
    await user.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const registration = async (req, res, next) => {
  try {
    const { error } = registSchema.validate(req.body);
    if (error) {
      throw HttpError(400, `Validation error: ${error.details[0].message}`);
    }

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw HttpError(409, "Email in use");
    }
    const avatarURL = gravatar.url(email, { size: '250' }, true);
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, avatarURL, password: hashPassword });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};



const subscription = async (req, res, next) => {
  try {
    const { subscription: newValueSub } = req.body;
    const { email, _id } = req.user;

    const allowedSubscriptions = ["starter", "pro", "business"];

    if (!allowedSubscriptions.includes(newValueSub)) {
      return res.status(400).json({ message: "This subscription does not exist" });
    }

    const updatedUser = await User.findByIdAndUpdate(_id, { subscription: newValueSub }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email,
      subscription: updatedUser.subscription
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { registration, login, currentUser, logout, subscription, uploadAvatar};