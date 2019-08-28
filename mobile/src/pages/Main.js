import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import {
	SafeAreaView,
	View,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity
} from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

const Main = ({ navigation }) => {
	const [users, setUsers] = useState([]);
	const [matchDev, setMatchDev] = useState(null);
	const userID = navigation.getParam('user');

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

	// Conexão com o Socket
	useEffect(() => {
		const socket = io('http://localhost:3333', {
			query: { user: userID }
		});

		socket.on('match', dev => {
			setMatchDev(dev);
		});
	}, [userID]);

	const handleLike = async () => {
		const [user, ...rest] = users;

		await api.post(`/devs/${user._id}/likes`, null, {
			headers: { user: userID }
		});

		setUsers(rest);
	};

	const handleDislike = async () => {
		const [user, ...rest] = users;

		await api.post(`/devs/${user._id}/dislikes`, null, {
			headers: { user: userID }
		});

		setUsers(rest);
	};

	handleLogout = async () => {
		await AsyncStorage.clear();

		navigation.navigate('Login');
	};

	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity onPress={handleLogout}>
				<Image style={styles.logo} source={logo} />
			</TouchableOpacity>

			<View style={styles.cardsContainer}>
				{users.length > 0
				? (
					users.map((user, index) => (
						<View key={user._id} style={[styles.card, { zIndex: (users.length - index)}]}>
							<Image style={styles.avatar} source={{ uri: user.avatar }} />

							<View style={styles.footer}>
								<Text style={styles.name}>{user.name}</Text>
								<Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
							</View>

							<Text style={styles.quantity}>{index + 1} / {users.length + 1}</Text>
						</View>
					))
				)
				: (
					<Text style={styles.empty}>Acabou :(</Text>
				)}
			</View>

			{users.length > 0 && (
				<View style={styles.buttonsContainer}>
					<TouchableOpacity style={styles.button} onPress={handleDislike}>
						<Image style={styles.like} source={dislike} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={handleLike}>
						<Image style={styles.dislike} source={like} />
					</TouchableOpacity>
				</View>
			)}

			{matchDev && (
				<View style={match.container}>
					<Image style={match.image} source={itsamatch} />
					<Image style={match.avatar} source={{ uri: matchDev.avatar }} />
					<Text style={match.name}>{matchDev.name}</Text>
					<Text style={match.bio}>{matchDev.bio}</Text>

					<TouchableOpacity onPress={() => setMatchDev(null)}>
						<Text style={match.close}>Fechar</Text>
					</TouchableOpacity>
				</View>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		flex: 1,
		justifyContent: 'space-between',
	},

	logo: {
		marginTop: 30,
	},

	empty: {
		alignSelf: 'center',
		color: '#999',
		fontSize: 24,
		fontWeight: 'bold',
	},

	cardsContainer: {
		alignSelf: 'stretch',
		flex: 1,
		justifyContent: 'center',
		maxHeight: 500,
	},

	card: {
		borderColor: '#ddd',
		borderRadius: 8,
		borderWidth: 1,
		bottom: 0,
		left: 0,
		margin: 30,
		minHeight: 350,
		overflow: 'hidden',
		position: 'absolute',
		right: 0,
		top: 0,
	},

	quantity: {
		backgroundColor: '#fff',
		borderRadius: 50,
		margin: 5,
		paddingHorizontal: 10,
		position: 'absolute',
		top: 0,
		zIndex: 100,
	},

	avatar: {
		flex: 1,
		height: 300,
	},

	footer: {
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingVertical: 15,
	},

	name: {
		color: '#333',
		fontSize: 16,
		fontWeight: 'bold',
	},

	bio: {
		color: '#999',
		fontSize: 14,
		lineHeight: 18,
		marginTop: 5,
	},

	buttonsContainer: {
		flexDirection: 'row',
		marginBottom: 30,
	},

	button: {
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 25,
		elevation: 2,
		height: 50,
		justifyContent: 'center',
		marginHorizontal: 20,
		shadowColor: '#000',
		shadowOffset: {
			height: 2,
			width: 0,
		},
		shadowOpacity: .05,
		shadowRadius: 2,
		width: 50,

	}
});

const match = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, .8)',
		justifyContent: 'center',
		paddingHorizontal: 30,
		zIndex: 9999,
	},

	image: {
		height: 60,
		resizeMode: 'contain',
	},

	avatar: {
		borderColor: '#fff',
		borderRadius: 80,
		borderWidth: 5,
		height: 160,
		marginVertical: 30,
		width: 160,
	},

	name: {
		color: '#fff',
		fontSize: 26,
		fontWeight: 'bold',
	},

	bio: {
		color: 'rgba(255, 255, 255, .8)',
		marginTop: 10,
		fontSize: 14,
		textAlign: 'center',
		lineHeight: 22,
	},

	close: {
		color: 'rgba(255, 255, 255, .8)',
		marginTop: 30,
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default Main;