const passport = require("passport");
const LocalStrategy = require("passport-local");

const pool = require("../database");
const bcrypt = require("../helpers/auth");

passport.use(
	"local.signin",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			const rows = await pool.query("SELECT * FROM users WHERE email = ?", [
				email,
			]);
			if (rows.length > 0) {
				const user = rows[0];
				const validPassword = await bcrypt.comparePasswords(
					password,
					user.password
				);
				if (validPassword) done(null, user);
				else
					done(
						null,
						false,
						req.flash("error", "Email y/o contraseña incorrecta")
					);
			} else
				done(
					null,
					false,
					req.flash("error", "Email y/o contraseña incorrecta")
				);
		}
	)
);
// si se loguea se almacena en sesion
passport.serializeUser((user, done) => {
	console.log("Serialize: ");
	console.log(user);
	done(null, user.email);
});

// utilizar los datos de la sesion
passport.deserializeUser(async (email, done) => {
	console.log(email);
	const user = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
	done(null, user[0]);
});
