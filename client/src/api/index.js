import axios from './axios';
export function createAPI(options = {}) {
	return axios.post('/create', options);
}

export function queryList(params = {}) {
	return axios.get('/query', {
		params
	});
}