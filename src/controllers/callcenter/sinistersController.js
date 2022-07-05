const moment = require("moment");
const { Car, User, Sinister } = require("../../models/index");

const controller = {};

controller.create = async (req, res) => {
	const car_id = req.params.car_id;
	const car = await Car.findById(car_id);
	const user = await User.findById(car.user_id);
	res.render("callcenter/sinisters/create.html", {
		title: "Registrar siniestro",
		file: "callcenter.cars",
		car,
		user,
		dateNow: moment(Date.now()).format("YYYY-MM-DD"),
	});
};

controller.store = async (req, res) => {
	const car_id = req.params.car_id;
	const { description, date } = req.body;
	const errors = [];

	if (description.length === 0) {
		errors.push({ text: "La descripcion es requerida" });
	}

	if (date.length === 0) {
		errors.push({ text: "La fecha es requerida" });
	}

	if (errors.length > 0) {
		req.flash("errors", errors);
		req.flash("data", { description, date });
		return res.redirect(`/callcenter/sinisters/${car_id}`);
	}

	const sinister = { car_id, description, date };
	await Sinister.create(sinister);

	const car = await Car.findById(car_id);
	await Car.update(car.id, { state: 3 });
	req.flash("success", "Siniestro registrado");
	res.redirect(`/callcenter/cars/${car.user_id}`);
};

controller.withdraw = async (req, res) => {
	const cars = await Sinister.findWithdraw();

	res.render("callcenter/sinisters/withdraw.html", {
		title: "Retirar automoviles",
		file: "callcenter.withdraw",
		cars,
	});
};

controller.finalized = async (req, res) => {
	const sinister_id = req.params.sinister_id;

	const sinister = await Sinister.findById(sinister_id);
	await Car.update(sinister.car_id, { state: 1 });
	await Sinister.update(sinister_id, { state_id: 5 });

	req.flash("success", "Automovil retirado");
	res.redirect(`/callcenter/sinisters/withdraw`);
};

module.exports = controller;
