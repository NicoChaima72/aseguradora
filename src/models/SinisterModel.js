const pool = require("../database");

const model = {};

model.create = async (sinister) => {
	const result = await pool.query("INSERT INTO sinisters SET ?", [sinister]);

	return result;
};

model.find = async () => {};

model.findById = async (id) => {
	const sinister = await pool.query(
		"SELECT u.id AS user_id, u.rut AS user_rut, u.name AS user_name, u.email AS user_email, c.id AS car_id, c.patent AS car_patent, c.description AS car_description, DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS car_created_at, s.id AS sinister_id, s.description AS sinister_description, DATE_FORMAT(s.date, '%Y-%m-%d') AS sinister_date, DATE_FORMAT(s.created_at, '%Y-%m-%d %H:%i:%s') AS sinister_created_at, s.state_id AS state_id, ss.description AS state_description FROM sinisters s INNER JOIN states_sinisters ss ON s.state_id = ss.id INNER JOIN cars c ON s.car_id = c.id INNER JOIN users u ON c.user_id = u.id  WHERE s.id = ?;",
		[id]
	);

	return sinister.length > 0 ? sinister[0] : null;
};

model.findByState = async (state) => {
	const sinisters = await pool.query(
		"SELECT u.rut, s.id, s.car_id, s.state_id, c.patent, c.description, DATE_FORMAT(s.created_at, '%Y-%m-%d %H:%i') as created_at  FROM sinisters s INNER JOIN cars c ON s.car_id = c.id INNER JOIN users u ON c.user_id = u.id WHERE state_id = ?",
		[state]
	);
	return sinisters;
};

model.findWithdraw = async () => {
	const sinisters = await pool.query(
		"SELECT s.id, c.patent, u.rut, DATE_FORMAT(s.updated_at, '%Y-%m-%d %H:%i') AS updated_at  FROM sinisters s INNER JOIN cars c ON s.car_id = c.id INNER JOIN users u ON c.user_id = u.id WHERE state_id = 4;"
	);

	return sinisters;
};

model.findByUser = async (user_id) => {
	const sinisters = await pool.query(
		"SELECT u.rut, c.user_id, s.id, s.car_id, s.state_id, ss.description AS state_description, ss.color as state_color, c.patent, c.description, DATE_FORMAT(s.created_at, '%Y-%m-%d %H:%i') as created_at, DATE_FORMAT(s.updated_at, '%Y-%m-%d %H:%i') as updated_at, s.observation FROM sinisters s INNER JOIN states_sinisters ss ON s.state_id = ss.id INNER JOIN cars c ON s.car_id = c.id INNER JOIN users u ON c.user_id = u.id WHERE u.id = ? AND c.state != 0;",
		[user_id]
	);

	return sinisters;
};

model.findDetail = async (sinister_id) => {
	const detail = await pool.query(
		"SELECT c.id AS car_id, c.patent AS car_patent, s.id AS sinister_id, s.state_id AS state_id, s.description AS sinister_description, s.date AS sinister_date, s.created_at AS sinister_created_at, s.updated_at AS sinister_updated_at, s.mechanic_id  AS sinister_mechanic_id,   s.observation AS sinister_observation, ss.description AS state_description, ss.color AS state_color, d.id AS detail_id, d.mechanic_id AS detail_mechanic_id, d.observations AS detail_observations, d.created_at AS detail_created_at, d.updated_at AS detail_updated_at FROM sinisters s INNER JOIN states_sinisters ss ON s.state_id = ss.id INNER JOIN cars c ON c.id = s.car_id LEFT JOIN details d ON d.sinister_id = s.id WHERE s.id = ?",
		[sinister_id]
	);
	return detail.length > 0 ? detail[0] : null;
};

model.update = async (id, params) => {
	const result = await pool.query("UPDATE sinisters SET ? WHERE id = ?", [
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
