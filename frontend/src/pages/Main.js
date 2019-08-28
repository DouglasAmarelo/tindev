import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import api from '../services/api';

import './main.scss';

import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';
import logo from '../assets/logo.svg';
import itsamatch from '../assets/itsamatch.png';

const Main = ({ match }) => {
	const [users, setUsers] = useState([]);
	const [matchDev, setMatchDev] = useState(false);
	const userID = match.params.id;

	// Chamada na API
	useEffect(() => {
		const loadUsers = async () => {
			const response = await api.get('/devs', {
				headers: { user: userID }
			});

			setUsers(response.data);
		};

		loadUsers();
	}, [userID]);

	// Conexão con o Socket
	useEffect(() => {
		const socket = io('http://localhost:3333', {
			query: { user: userID }
		});

		socket.on('match', dev => {
			setMatchDev(dev);
		});
	}, [userID]);

	const handleLike = async id => {
		await api.post(`/devs/${id}/likes`, null, {
			headers: { user: userID }
		});

		setUsers(users.filter(user => user._id !== id));
	};

	const handleDislike = async id => {
		await api.post(`/devs/${id}/dislikes`, null, {
			headers: { user: userID }
		});

		setUsers(users.filter(user => user._id !== id));
	};

	return (
		<div className="main-container">
			<Link to="/">
				<img src={logo} alt="tindev"/>
			</Link>

			{users.length > 0 ? (
				<ul className="card-list">
					{users && users.map(user => (
						<li className="card" key={user._id}>
							<img className="card__image" src={user.avatar} alt={user.name}/>

							<footer className="card__content">
								<strong className="card__title">{user.name ? user.name : user.user}</strong>
								<p className="card__text">{user.bio}</p>
							</footer>

							<div className="card__buttons">
								<button
									onClick={() => handleDislike(user._id)}
									type="button"
								>
									<img src={dislike} alt="Dislike"/>
								</button>

								<button
									onClick={() => handleLike(user._id)}
									type="button"
								>
									<img src={like} alt="Like"/>
								</button>
							</div>
						</li>
					))}
				</ul>
			) : (
				<div className="empty">
					Acabou :(
				</div>
			)}

			{ matchDev && (
				<div className="match-container">
					<img className="match__image" src={itsamatch} alt="It's a match!"/>

					<img className="match__avatar" src={matchDev.avatar} alt="Brunin"/>
					<strong className="match__name">{matchDev.name}</strong>
					<p className="match__bio">{matchDev.bio}</p>

					<button
						className="match__btn"
						type="button"
						onClick={() => setMatchDev(false)}
					>
						Fechar
					</button>
				</div>
			)}
		</div>
	);
}

export default Main;