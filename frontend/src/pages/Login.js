import React, { useState } from 'react';

import './login.scss';
import logo from '../assets/logo.svg';

import api from '../services/api';

const Login = ({ history }) => {
	const [username, setUsername] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		const response = await api.post('/devs', { username });

		const { _id } = response.data;

		history.push(`/dev/${_id}`);
	};

	return (
		<div className="login-container">
			<form onSubmit={handleSubmit}>
				<img src={logo} alt="tindev"/>
				<input
					placeholder="Digite seu usuário no GitHub"
					type="text"
					name=""
					id=""
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>

				<button type="submit">Enviar</button>
			</form>
		</div>
	);
};

export default Login;