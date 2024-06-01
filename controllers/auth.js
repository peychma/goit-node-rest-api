const registration = require("./auth/registration");
const login = require("./auth/login");
const currentUser = require("./auth/currentUser");
const logout = require("./auth/logout");
const subscription = require("../controllers/auth/subscription")

module.exports = { registration, login, currentUser, logout, subscription};