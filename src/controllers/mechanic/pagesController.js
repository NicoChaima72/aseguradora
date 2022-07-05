const controller = {};

controller.index = async (req, res) => {
	res.render("mechanic/dashboard.html", { title: "H", file: "F" });
};

module.exports = controller;
