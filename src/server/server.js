const path = require("path");
const ejs = require("ejs");
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const passport = require("passport");
require("dotenv").config();

const flash = require("connect-flash");
const { database } = require("../keys");
const routes = require("../routes/routes");

module.exports = (app) => {
  // settings
  app.set("port", process.env.PORT);
  app.set("views", path.join(__dirname, "../views"));
  app.engine("html", ejs.renderFile);
  app.set("view engine", "ejs");

  // middlewares
  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride("_method"));
  app.use(
    session({
      cookie: { maxAge: 86400000 },
      store: mysqlSession(database),
      secret: "session_secret",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // global variables
  app.use((req, res, next) => {
    res.locals.global_title = "Aseguradora";
    res.locals.global_success = req.flash("success");
    res.locals.global_errors = req.flash("errors");
    res.locals.global_error = req.flash("error");
    res.locals.global_user = req.user || null;
    res.locals.global_data = req.flash("data");
    if (res.locals.global_data.length > 0)
      res.locals.global_data = res.locals.global_data[0];
    next();
  });

  // routes
  routes(app);

  // static files
  app.use(
    "/js",
    express.static(path.join(__dirname, "../../node_modules/bootstrap/dist/js"))
  );
  app.use(
    "/css",
    express.static(
      path.join(__dirname, "../../node_modules/bootstrap/dist/css")
    )
  );

  app.use("/public", express.static(path.join(__dirname, "../../public")));

  return app;
};
