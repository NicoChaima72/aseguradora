const { Car, Sinister } = require("../../models/index");

const controller = {};

controller.pending = async (req, res) => {
	const cars = await Car.findByState(3);
	res.render("mechanic/cars/pending.html", { title: "H", file: "F", cars });
};

module.exports = controller;
