let mysql = require('mysql'),
	config = require('../config');
let pool = mysql.createPool(config.SQL);

function query(sql) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject(err.message);
				return;
			}
			connection.query(sql, function (err, rows) {
				if (err) {
					reject(err.message);
					connection.release();
					return;
				}
				resolve(rows);
				connection.release();
			});
		});
	});
}

function queryParams(sql, params) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject(err.message);
				return;
			}
			connection.query(sql, params, function (err, rows) {
				if (err) {
					reject(err.message);
					connection.release();
					return;
				}
				resolve(rows);
				connection.release();
			});
		});
	});
}

module.exports = {
	query,
	queryParams
};