import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login';
import Main from './pages/Main';

const Routes = () => (
	<BrowserRouter>
		<Route path="/" exact component={Login} />
		<Route path="/dev/:id" component={Main} />
	</BrowserRouter>
);

export default Routes;