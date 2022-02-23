const express = require('express')
const path = require('path');
const compression = require('compression')
const engine = require('ejs-mate');
// const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const session = require('express-session');
// const passport = require('passport');
const flash = require('connect-flash');
const sequelize = require('./database/db');
const passport = require('passport');
const {PUERTO} = require('./variableGlobal/config');


// require('./database');
require('./passport/local-auth');
require('./database/crons');
app.use(compression())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'mysecretkey_magic',
  resave: false,
  saveUninitialized: false

}));

app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.static(__dirname+'/public'));
const port = process.env.PORT || PUERTO;
// app.get('/', (req, res) => {
//   res.render('principal')
// });

// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.initialize());
// app.use(passport.session());

app.use((req,res, next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
app.use((req,res, next)=>{
   app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  // console.log(app.locals)
  next();
})
app.use('/', require('./routes/index'));
// :04:15-05:00
// cron.schedule('* * * * *', function() {
//   console.log('running a task every minute');
// });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
  // sequelize.authenticate().then(()=>{
  sequelize.sync({force: false}).then(()=>{
      console.log('Nos hemos conectado a la base de datos')
  }).catch(error => {
      console.log(error);
  })
});