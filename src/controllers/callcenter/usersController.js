const { User } = require("../../models/index");
const helpers = require("../../helpers/helpers");
const auth = require("../../helpers/auth");

const controller = {};

controller.index = async (req, res) => {
	const users = await User.find();
	res.render("callcenter/users/index.html", {
		title: "Listado de usuarios",
		file: "callcenter.users",
		users: users.filter((user) => user.role == "USER_ROLE"),
	});
};

controller.create = (req, res) => {
	res.render("callcenter/users/create.html", {
		title: "Agregar usuario",
		file: "callcenter.users",
	});
};

controller.store = async (req, res) => {
	const { rut, name, email } = req.body;
	const role = "USER_ROLE";
	const password = rut.replace("-", "");
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

	if (errors.length > 0) {
		req.flash("errors", errors);
		req.flash("data", {
			rut,
			name,
			email,
		});
		return res.redirect("/callcenter/users/create");
	}

	const user = { rut, name, email, password, role };
	user.password = await auth.encryptPassword(password);
	await User.create(user);

	req.flash("success", "Usuario agregado");
	res.redirect("/callcenter/users");
};

controller.show = async (req, res) => {
	const id = req.params.id;
	const user = await User.findById(id);
	res.render("callcenter/users/view.html", {
		title: "Ver usuario",
		file: "callcenter.users",
		user,
	});
};

controller.edit = async (req, res) => {
	const id = req.params.id;
	const user = await User.findById(id);
	res.render("callcenter/users/edit.html", {
		title: "Editar usuario",
		file: "callcenter.users",
		user,
	});
};

controller.update = async (req, res) => {
	const id = req.params.id;
	const { name, type } = req.body;
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}

	if (errors.length > 0) {
		req.flash("errors", errors);
		req.flash("data", { name, type });
		return res.redirect(`/callcenter/users/${id}/edit`);
	}

	const params = { name };
	await User.update(id, params);

	req.flash("success", "Usuario actualizado");
	res.redirect(`/callcenter/users`);
};

controller.destroy = async (req, res) => {
	const id = req.params.id;
	await User.delete(id);
	req.flash("success", "Usuario dado de baja");
	res.redirect(`/callcenter/users`);
};

module.exports = controller;
