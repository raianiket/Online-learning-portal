const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

const courseRouter = require('./routes/courses')
const userRouter = require('./routes/users')

mongoose.connect(
    'mongodb+srv://devuser:abcd1234@cluster0-5b1ty.mongodb.net/lms?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('DB Connected!')
)

const app = express()
const store = new MongoDBStore({
  uri: 'mongodb+srv://devuser:abcd1234@cluster0-5b1ty.mongodb.net/lms?retryWrites=true&w=majority',
  collection: 'sessions'
});

const sess = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}

app.use(session(sess))
app.set('view engine', 'ejs')
app.set('views', 'views')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/courses', courseRouter)
app.use('/', userRouter)

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});


module.exports = app