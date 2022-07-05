const controller = {};

controller.index = async (req, res) => {
	res.render("callcenter/dashboard.html", { title: "H", file: "F" });
};

module.exports = controller;
