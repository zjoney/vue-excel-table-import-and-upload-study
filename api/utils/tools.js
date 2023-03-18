// MD5的二次加密处理
function handleMD5(val = '') {
	val = val.substring(4);
	val = val.split('').reverse().join('');
	val = val.substring(4);
	return val;
}

// 返回结果的批处理
function success(flag = true, options = {}) {
	let defaults = {
		code: flag ? 0 : 1,
		codeText: flag ? 'OK' : 'NO'
	};
	return Object.assign(defaults, options);
}

// 处理插入的SQL语句
function insertSQL(table, options = {}) {
	let arrKey = Object.keys(options),
		arrValue = [];
	arrKey.forEach(item => arrValue.push(options[item]));
	return `INSERT INTO ${table} (${arrKey}) VALUES(${arrValue.map(item=>{
		return `'${item}'`;
	})})`;
}

module.exports = {
	handleMD5,
	success,
	insertSQL
};