require("../config/passport");
const passport = require("passport");

const controller = {};

controller.showLogin = async (req, res) => {
	res.render("auth/login.html", {
		title: "Iniciar sesion",
		file: "auth.login",
	});
};

controller.login = async (req, res, next) => {
	passport.authenticate("local.signin", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true,
	})(req, res, next);
};

controller.showRegister = async (req, res) => {
	res.render("auth/register.html", {
		title: "Registrarme",
		file: "auth.register",
	});
};

controller.register = async (req, res) => {};

controller.logout = async (req, res) => {
	req.logOut();
	res.redirect("/");
};

module.exports = controller;
