const controller = {};

controller.index = async (req, res) => {
	res.render("admin/dashboard.html", { title: "H", file: "F" });
};

module.exports = controller;
