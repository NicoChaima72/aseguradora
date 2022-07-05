const { Car, Sinister } = require("../../models/index");

const controller = {};

controller.index = async (req, res) => {
	const cars = await Car.findByUser(req.user.id);
	res.render("user/cars/index.html", {
		title: "Mis automoviles",
		file: "user.cars",
		cars,
	});
};

module.exports = controller;
