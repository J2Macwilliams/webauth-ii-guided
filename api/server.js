const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions); //to store session in the database

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knex = require('../database/dbConfig');

const server = express();

const sessionConfig = {
	//session storage options
	name: 'chocolatechip', //default would be sid
	secret: 'keep it secret, keep it safe!', //used for encryption (must be an environment variable)
	saveUninitialized: true, //implications with the law
	reSave: false,

	//Don't forget the new keyword
	store: new KnexSessionStore({
		knex,
		createtable: true,
		clearInterval: 1000 * 60 * 10,
    sidfieldname: 'sid',
    
		//optional
		tablename: 'sessions'
	}),

	cookie: {
		maxAge: 1000 * 60 * 10, //10 mins in milliseconds
		secure: false, //if false the cookie is sent over http, if true sent over http
		httpOnly: true //if true JS cannot access the cookie
	}
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfig)); //add a req.session object

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.json({ api: 'up' });
});

module.exports = server;
