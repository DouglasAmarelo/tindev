const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

const server = express();

mongoose.connect('mongodb+srv://admindatabase:admindatabase@cluster0-sisl5.mongodb.net/omnistack8?retryWrites=true&w=majority', {
	useNewUrlParser: true
});

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(3333);