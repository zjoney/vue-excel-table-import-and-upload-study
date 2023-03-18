const CONFIG = require('./config'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	db = require('./utils/db'),
	tools = require('./utils/tools');

/* TOOLS */
let {
	insertSQL,
	success
} = tools;

/*-CREATE SERVER-*/
const express = require('express'),
	app = express();
app.listen(CONFIG.PORT, () => {
	console.log(`SERVICE IS OK ===> ${CONFIG.PORT}`);
});

/*-MIDDLE WARE-*/
app.use(session(CONFIG.SESSION));
app.use(bodyParser.urlencoded({
	extended: false
}));

/*-API-*/
app.post('/create', (req, res) => {
	let SQL = insertSQL('user', req.body);
	db.query(SQL).then(result => {
		res.send(success(true, {
			data: result
		}));
	}).catch(reason => {
		res.send(success(false, {
			data: reason
		}));
	});
});

app.get('/query', (req, res) => {
	let {
		limit = 10,
			page = 1,
			search = ''
	} = req.query;
	limit = parseInt(limit);
	page = parseInt(page);

	// 获取数据
	let count = 0;
	let SQL = `SELECT * FROM user `,
		SQL2 = ``;
	if (search !== "") {
		SQL += `WHERE `;
		SQL += `(name LIKE '%${search}%' OR phone LIKE '%${search}%') `;
	}
	SQL += `order by id desc `;
	SQL2 = SQL.replace('*', 'COUNT(*)');
	db.query(SQL2).then(result => {
		return parseInt(result[0]['COUNT(*)']);
	}).then(result => {
		count = result;
		SQL += `limit ${(page-1)*limit},${limit} `;
		return db.query(SQL);
	}).then(result => {
		res.send(success(true, {
			count,
			page,
			limit,
			data: result
		}));
	}).catch(reason => {
		res.send(success(false, {
			data: reason
		}));
	});
});

app.use(express.static('./static'));
app.use((req, res) => {
	res.status(404);
	res.send('NOT FOUND!');
});