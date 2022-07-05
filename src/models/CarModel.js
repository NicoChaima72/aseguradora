const pool = require("../database");

const model = {};

model.users = async () => {
	// const users = await pool.query(
	// 	"SELECT u.id, u.rut, u.name, count(c.user_id) as cars_count FROM users u LEFT JOIN cars c ON u.id = c.user_id WHERE u.role = 'USER_ROLE' AND u.state != 0 GROUP BY u.id ORDER BY u.id DESC"
	// );

	const cars = await pool.query(
		"SELECT u.id, u.rut, u.name, count(c.user_id) as cars_count FROM users u LEFT JOIN (SELECT * FROM cars WHERE state != 0) c ON u.id = c.user_id WHERE u.role = 'USER_ROLE' AND u.state != 0 GROUP BY u.id ORDER BY u.id DESC"
	);

	return cars;
};

model.findById = async (id) => {
	const car = await pool.query(
		"SELECT * FROM cars WHERE id = ? AND state != 0",
		[id]
	);

	return car.length > 0 ? car[0] : null;
};

model.findByPatent = async (id) => {
	const car = await pool.query(
		"SELECT * FROM cars WHERE patent = ? AND state != 0",
		[id]
	);

	return car.length > 0 ? car[0] : null;
};

model.findByUser = async (user_id) => {
	const cars = await pool.query(
		"SELECT * FROM cars WHERE user_id = ?  AND state != 0",
		[user_id]
	);

	return cars;
};

model.findByState = async (state) => {
	const cars = await pool.query("SELECT * FROM cars WHERE state = ?", [state]);

	return cars;
};

model.findWithdraw = async () => {
	const cars = await pool.query(
		"SELECT c.id, c.patent, c.description, DATE_FORMAT(c.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at, u.rut, u.name FROM cars c INNER JOIN users u ON c.user_id = u.id WHERE c.state = 4"
	);

	return cars;
};

model.create = async (car) => {
	const result = await pool.query("INSERT INTO cars SET ?", [car]);

	return result;
};

model.update = async (id, params) => {
	const result = await pool.query("UPDATE cars SET ? WHERE id = ?", [
		params,
		id,
	]);

	return result;
};

model.delete = async (id) => {
	const result = await pool.query("UPDATE cars SET state = 0 WHERE id = ?", [
		id,
	]);

	return result;
};

module.exports = model;
