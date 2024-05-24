const express = require("express");
const router = express.Router();
const { validateBody } = require("../helpers/validateBody");
const {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema
} = require("../schemas/contactsSchemas");

const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact
} = require("../controllers/contactsControllers");

router.get("/", getAllContacts);
router.get("/:id", getOneContact);
router.post("/", validateBody(createContactSchema), createContact);
router.delete("/:id", deleteContact);
router.put("/:id", validateBody(updateContactSchema), updateContact);
router.patch("/:id/favorite", validateBody(updateFavoriteSchema), updateStatusContact);

module.exports = router;


