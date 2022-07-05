const pool = require("../database");

const model = {};

model.create = async (detail) => {
	const result = await pool.query("INSERT INTO details SET ?", [detail]);

	return result;
};

model.findBySinister = async (sinister_id) => {
	const detail = await pool.query(
		"SELECT * FROM details WHERE sinister_id = ?",
		[sinister_id]
	);

	return detail.length > 0 ? detail[0] : null;
};

model.updateBySinister = async (sinister_id, params) => {
	const result = await pool.query(
		"UPDATE details SET ? WHERE sinister_id = ?",
		[params, sinister_id]
	);

	return result;
};
module.exports = model;
