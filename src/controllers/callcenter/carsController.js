const { User, Car } = require("../../models/index");

const controller = {};

controller.users = async (req, res) => {
	const users = await Car.users();
	res.render("callcenter/cars/users.html", {
		title: "Listado de automoviles",
		file: "callcenter.cars",
		users,
	});
};

controller.index = async (req, res) => {
	const user_id = req.params.user_id;
	const user = await User.findById(user_id);
	const cars = await Car.findByUser(user_id);
	res.render("callcenter/cars/index.html", {
		title: "Listado de automoviles por usuario",
		file: "callcenter.cars",
		user,
		cars,
	});
};

controller.create = async (req, res) => {
	const user_id = req.params.user_id;
	const user = await User.findById(user_id);
	res.render("callcenter/cars/create.html", {
		title: "Registrar automovil",
		file: "callcenter.cars",
		user,
	});
};

controller.store = async (req, res) => {
	const user_id = req.params.user_id;
	const { patent, description, year } = req.body;
	const errors = [];
	const carPatent = await Car.findByPatent(patent.toUpperCase());

	if (carPatent) {
		errors.push({ text: "La patente ya está registrada" });
	}

	if (patent.length === 0) {
		errors.push({ text: "La patente es requerida" });
	}

	if (description.length === 0) {
		errors.push({ text: "La descripcion es requerida" });
	}

	if (year.length !== 4) {
		errors.push({ text: "El año es invalido" });
	}

	if (errors.length > 0) {
		req.flash("errors", errors);
		req.flash("data", { patent, description, year });
		return res.redirect(`/callcenter/cars/${user_id}/create`);
	}

	const car = { user_id, patent: patent.toUpperCase(), description, year };

	await Car.create(car);
	req.flash("success", "Automovil registrado");
	res.redirect(`/callcenter/cars/${user_id}`);
};

controller.show = async (req, res) => {
	const { user_id, car_id } = req.params;
	const user = await User.findById(user_id);
	const car = await Car.findById(car_id);

	res.render("callcenter/cars/view.html", {
		title: "Ver automovil",
		file: "callcenter.cars",
		user,
		car,
	});
};

controller.edit = async (req, res) => {
	const { user_id, car_id } = req.params;
	const user = await User.findById(user_id);
	const car = await Car.findById(car_id);
	res.render("callcenter/cars/edit.html", {
		title: "Editar automovil",
		file: "callcenter.cars",
		user,
		car,
	});
};

controller.update = async (req, res) => {
	const { user_id, car_id } = req.params;
	const { description, year } = req.body;
	const errors = [];

	if (description.length === 0) {
		errors.push({ text: "La descripcion es requerida" });
	}

	if (year.length !== 4) {
		errors.push({ text: "El año es invalido" });
	}

	if (errors.length > 0) {
		req.flash("errors", errors);
		req.flash("data", { description, year });
		return res.redirect(`/callcenter/cars/${user_id}/${car_id}/edit`);
	}

	const params = { description, year };
	await Car.update(car_id, params);

	req.flash("success", "Automovil actualizado");
	res.redirect(`/callcenter/cars/${user_id}`);
};

controller.destroy = async (req, res) => {
	const { user_id, car_id } = req.params;
	await Car.delete(car_id);
	req.flash("success", "Automovil dado de baja");
	res.redirect(`/callcenter/cars/${user_id}`);
};

module.exports = controller;
