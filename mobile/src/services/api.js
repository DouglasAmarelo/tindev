import axios from 'axios';

const api = axios.create({
	baseURL: `http://localhost:3333`,
	// baseURL: `http://192.168.56.1`,
	// baseURL: `http://10.0.3.2:3333`,
});

export default api;