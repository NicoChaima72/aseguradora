module.exports = {
	users: require("./usersController"),
	home: require("./homeController"),
	auth: require("./authController"),
	admin: {
		pages: require("./admin/pagesController"),
		users: require("./admin/usersController"),
	},
	callcenter: {
		pages: require("./callcenter/pagesController"),
		users: require("./callcenter/usersController"),
		cars: require("./callcenter/carsController"),
		sinisters: require("./callcenter/sinistersController"),
	},
	mechanic: {
		pages: require("./mechanic/pagesController"),
		cars: require("./mechanic/carsController"),
		sinisters: require("./mechanic/sinistersController"),
	},
	user: {
		pages: require("./user/pagesController"),
		cars: require("./user/carsController"),
		sinisters: require("./user/sinistersController"),
	},
};
