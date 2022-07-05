const { User } = require("../../models/index");
const helpers = require("../../helpers/helpers");
const auth = require("../../helpers/auth");

const controller = {};

controller.index = async (req, res) => {
	const users = await User.find();
	res.render("admin/users/index.html", {
		title: "Listado de usuarios",
		file: "admin.users",
		callcenters: users.filter((user) => user.role == "CALLCENTER_ROLE"),
		mechanics: users.filter((user) => user.role == "MECHANIC_ROLE"),
	});
};

controller.create = (req, res) => {
	res.render("admin/users/create.html", { title: "H", file: "F" });
};

controller.store = async (req, res) => {
	const { rut, name, username, type, password, password_confirm } = req.body;
	const email = `${username}@aseguradora.com`;
	const role = type === "mechanic" ? "MECHANIC_ROLE" : "CALLCENTER_ROLE";
	const errors = [];

	const userRut = await User.findByRut(rut);
	const userEmail = await User.findByEmail(email);

	if (userRut) {
		errors.push({ text: "El rut ya está registrado" });
	}

	if (!helpers.verifyRut(rut)) {
		errors.push({ text: "El rut es invalido" });
	}

	if (userEmail) {
		errors.push({ text: "El email ya está registrado" });
	}

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}

	if (password.length < 8) {
		errors.push({ text: "Contraseña de minimo 8 caracteres" });
	}

	if (password !== password_confirm) {
		errors.push({ text: "Las contraseñas no coinciden" });
	}
	if (!(type == "mechanic" || type == "callcenter")) {
		errors.push({ text: "El tipo de usuario es invalido" });
	}

	if (errors.length > 0) {
		req.flash("errors", errors);
		req.flash("data", {
			rut,
			name,
			username,
			type,
			password,
			password_confirm,
		});
		return res.redirect("/admin/users/create");
	}

	const user = { rut, name, email, password, role };
	user.password = await auth.encryptPassword(password);
	await User.create(user);

	req.flash("success", "Usuario agregado");
	res.redirect("/admin/users");
};

controller.show = async (req, res) => {
	const id = req.params.id;
	const user = await User.findById(id);
	res.render("admin/users/view.html", { title: "H", file: "F", user });
};

controller.edit = async (req, res) => {
	const id = req.params.id;
	const user = await User.findById(id);
	res.render("admin/users/edit.html", { title: "H", file: "F", user });
};

controller.update = async (req, res) => {
	const id = req.params.id;
	const { name, type } = req.body;
	const role = type === "mechanic" ? "MECHANIC_ROLE" : "CALLCENTER_ROLE";
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}

	if (!(type == "mechanic" || type == "callcenter")) {
		errors.push({ text: "El tipo de usuario es invalido" });
	}

	if (errors.length > 0) {
		req.flash("errors", errors);
		req.flash("data", { name, type });
		return res.redirect(`/admin/users/${id}/edit`);
	}

	const params = { name, role };
	await User.update(id, params);

	req.flash("success", "Usuario actualizado");
	res.redirect(`/admin/users`);
};

controller.destroy = async (req, res) => {
	const id = req.params.id;
	await User.delete(id);
	req.flash("success", "Usuario dado de baja");
	res.redirect(`/admin/users`);
};

module.exports = controller;
