const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');


// connect to DB and load models
require('./server/models').connect(config.dbUri);

const app = express();

app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));

// for server side
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

const authRoutes = require('./server/routes/auth');
app.use('/auth', authRoutes);

const authRoutes = require('./server/routes/api');
app.use('/api', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port: 3000');
});
