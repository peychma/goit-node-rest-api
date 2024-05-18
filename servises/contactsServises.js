const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.resolve( 'db', 'contacts.json');


async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading contacts file: ${error}`);
  }
}


async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.find(contact => contact.id === contactId) || null;
  } catch (error) {
    throw new Error(`Error getting contact by ID: ${error}`);
  }
}


async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const contactToRemove = contacts.find(contact => contact.id === contactId);
    if (!contactToRemove) return null;
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return contactToRemove;
  } catch (error) {
    throw new Error(`Error removing contact: ${error}`);
  }
}


async function addContact(name, email, phone) {
  try {
    const newContact = { id: `${Date.now()}`, name, email, phone };
    const contacts = await listContacts();
    const updatedContacts = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return newContact;
  } catch (error) {
    throw new Error(`Error adding contact: ${error}`);
  }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}
