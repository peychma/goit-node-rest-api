const Contact = require("../model/contact");
const { HttpError } = require("../helpers/HttpError");
const { createContactSchema, updateContactSchema, updateFavoriteSchema } = require("../schemas/schemas");

const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;

    const filter = { owner: req.user._id };
    if (favorite !== undefined) {
      filter.favorite = favorite === "true";
    }

    const contacts = await Contact.find(filter, "-createdAt -updatedAt", { skip, limit: Number(limit) })
      .populate("owner", "email subscription");

    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findOne({ _id: id, owner: req.user._id });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const { name, email, phone, favorite } = req.body;
    const newContact = new Contact({ name, email, phone, favorite, owner: req.user._id  });
    const result = await newContact.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const { id } = req.params;
    const contact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const { id } = req.params;
    const { favorite } = req.body;
    const contact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { favorite },
      { new: true }
    );
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};