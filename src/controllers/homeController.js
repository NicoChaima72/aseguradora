const controller = {};

controller.index = async (req, res) => {
	res.render("pages/home.html", { title: "Inicio" });
};

module.exports = controller;
