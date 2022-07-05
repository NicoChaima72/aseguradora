const { Car, Sinister, Detail, User } = require("../../models/index");

const controller = {};

controller.pending = async (req, res) => {
	const sinisters = await Sinister.findByState(1);
	res.render("mechanic/sinisters/pending.html", {
		title: "Listado de automoviles pendientes",
		file: "mechanic.pending",
		sinisters,
	});
};

controller.showPending = async (req, res) => {
	const sinister_id = req.params.sinister_id;

	const sinister = await Sinister.findById(sinister_id);
	console.log(sinister);
	res.render("mechanic/sinisters/show-pending.html", {
		title: "Ver automovil pendiente",
		file: "mechanic.pending",
		sinister,
	});
};

controller.updatePending = async (req, res) => {
	const sinister_id = req.params.sinister_id;
	const { observation, option } = req.body;
	const mechanic_id = req.user.id;
	const errors = [];

	if (observation.length === 0) {
		errors.push({ text: "La observacion es requerida" });
	}

	if (!(option == "Aceptar" || option == "Rechazar")) {
		errors.push({ text: "Opcion invalida" });
	}

	if (errors.length > 0) {
		req.flash("errors", errors);
		req.flash("data", { observation });
		return res.redirect(`/mechanic/sinisters/${sinister_id}/pending`);
	}

	const sinister = await Sinister.findById(sinister_id);
	const state_id = option == "Aceptar" ? 2 : 6;
	const params = { state_id, mechanic_id, observation };

	await Sinister.update(sinister_id, params);

	const state_car = state_id === 2 ? 2 : 1;

	await Car.update(sinister.car_id, { state: state_car });

	if (state_id === 2) req.flash("success", "Siniestro aceptado");
	else req.flash("success", "Siniestro rechazado");

	res.redirect("/mechanic/sinisters/pending");
};

controller.acepted = async (req, res) => {
	const sinisters = await Sinister.findByState(2);
	res.render("mechanic/sinisters/acepted.html", {
		title: "Listado automoviles aceptados",
		file: "mechanic.acepted",
		sinisters,
	});
};

controller.updateAcepted = async (req, res) => {
	const sinister_id = req.params.sinister_id;
	const { option } = req.body;
	const errors = [];

	if (!(option == "Pasar al taller" || option == "Eliminar")) {
		errors.push({ text: "Opcion invalida" });
	}

	if (errors.length > 0) {
		req.flash("errors", errors);
		return res.redirect(`/mechanic/sinisters/acepted`);
	}
	const state_id = option == "Pasar al taller" ? 3 : 0;
	const sinister = await Sinister.findById(sinister_id);
	await Sinister.update(sinister_id, { state_id });

	if (state_id == 3) {
		const detail = {
			sinister_id,
			observations: "Automovil pasado al taller",
			mechanic_id: req.user.id,
		};
		await Detail.create(detail);
		await Car.update(sinister.car_id, { state: 2 });
	} else {
		await Car.update(sinister.car_id, { state: 1 });
	}

	if (state_id === 3) req.flash("success", "Automovil pasado al taller");
	else req.flash("success", "Siniestro removido");

	res.redirect("/mechanic/sinisters/acepted");
};

controller.inProcess = async (req, res) => {
	const sinisters = await Sinister.findByState(3);
	res.render("mechanic/sinisters/process.html", {
		title: "Listado de automoviles en proceso",
		file: "mechanic.process",
		sinisters,
	});
};

controller.inProcessEdit = async (req, res) => {
	const sinister_id = req.params.sinister_id;
	const sinister = await Sinister.findById(sinister_id);
	const detail = await Detail.findBySinister(sinister_id);
	console.log(sinister);

	res.render("mechanic/sinisters/edit-process.html", {
		title: "Editando automovil en proceso",
		file: "mechanic.process",
		sinister,
		detail,
	});
};

controller.updateInProcess = async (req, res) => {
	const sinister_id = req.params.sinister_id;
	const { observations, option } = req.body;
	const errors = [];

	if (observations.length === 0) {
		errors.push({ text: "Las observaciones son obligatorias" });
	}

	if (!(option == "Guardar" || option == "Marcar como finalizado")) {
		errors.push({ text: "Opcion invalida" });
	}

	if (errors.length > 0) {
		req.flash("errors", errors);
		return res.redirect(`/mechanic/sinisters/in-process/${sinister_id}/edit`);
	}

	const detail = { observations, mechanic_id: req.user.id };
	await Detail.updateBySinister(sinister_id, detail);

	if (option !== "Guardar") {
		await Sinister.update(sinister_id, { state_id: 4 });
		const sinister = await Sinister.findById(sinister_id);
		await Car.update(sinister.car_id, { state: 4 });
		req.flash("success", "Automovil listo para retirar");
	} else req.flash("success", "Siniestro actualizado");

	res.redirect("/mechanic/sinisters/in-process");
};

controller.updateDeleted = async (req, res) => {
	const sinister = await Sinister.findById(req.params.sinister_id);
	await Sinister.update(sinister.sinister_id, { state_id: 0 });
	await Car.update(sinister.car_id, { state: 1 });
	req.flash("success", "Siniestro eliminado");
	res.redirect(req.get("referer"));
};

module.exports = controller;
