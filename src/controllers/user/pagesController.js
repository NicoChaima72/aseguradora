const controller = {};

controller.index = async (req, res) => {
	res.render("user/dashboard.html", { title: "H", file: "F" });
};

module.exports = controller;
