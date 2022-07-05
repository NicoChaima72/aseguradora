const middleware = {};

middleware.isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "No estás autenticado");
		res.redirect("/login");
	}
};

middleware.isNotAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "Ya estás autenticado");
		res.redirect("/");
	}
};

middleware.isAdmin = (req, res, next) => {
	if (req.user.role === "ADMIN_ROLE") {
		return next();
	} else {
		req.flash("error", "Acceso no autorizado");
		res.redirect("/");
	}
};

middleware.isCallcenter = (req, res, next) => {
	if (req.user.role === "CALLCENTER_ROLE") {
		return next();
	} else {
		req.flash("error", "Acceso no autorizado");
		res.redirect("/");
	}
};

middleware.isMechanic = (req, res, next) => {
	if (req.user.role === "MECHANIC_ROLE") {
		return next();
	} else {
		req.flash("error", "Acceso no autorizado");
		res.redirect("/");
	}
};

middleware.isUser = (req, res, next) => {
	if (req.user.role === "USER_ROLE") {
		return next();
	} else {
		req.flash("error", "Acceso no autorizado");
		res.redirect("/");
	}
};

module.exports = middleware;
