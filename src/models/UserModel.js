const pool = require("../database");

const model = {};

model.create = async (user) => {
	const result = await pool.query("INSERT INTO users SET ?", [user]);

	return result;
};

model.find = async () => {
	const users = await pool.query("SELECT * FROM users WHERE state = 1");

	return users;
};

model.findById = async (id) => {
	const user = await pool.query(
		"SELECT * FROM users WHERE id = ? AND state = 1",
		[id]
	);

	return user.length > 0 ? user[0] : null;
};

model.findByRut = async (rut) => {
	const user = await pool.query(
		"SELECT * FROM users WHERE rut = ? AND state = 1",
		[rut]
	);

	return user.length > 0 ? user[0] : null;
};

model.findByEmail = async (email) => {
	const user = await pool.query(
		"SELECT * FROM users WHERE email = ? AND state = 1",
		[email]
	);

	return user.length > 0 ? user[0] : null;
};

model.findByRole = async (role) => {
	const users = await pool.query("SELECT * FROM users WHERE role = ?", [role]);

	return users;
};

model.update = async (id, params) => {
	const result = await pool.query(
		"UPDATE users SET ? WHERE id = ? AND state = 1",
		[params, id]
	);

	return result;
};

model.delete = async (id) => {
	const result = await pool.query("UPDATE users SET state = 0 WHERE id = ?", [
		id,
	]);

	return result;
};

module.exports = model;
