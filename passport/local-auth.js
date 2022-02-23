const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

const User = require('../database/models/Usuarios');

passport.serializeUser((user, done) => {
  // console.log(user.id)
  done(null, user.id);
  // done(null, user[0].id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findAll({
      where:{"id": id}
    });
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findAll({
        where: {
          'email': email
        }
    })
  // console.log(user)
  if(user != "") {
    // return console.log("si hay usuario");
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  } else {


    var nuevaPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    var idTipoUsuario = req.body.idTipoUsuario;
    var tipoUsuario;
    var IdUsuarioPersonalizado = await windowGuid();
    if(idTipoUsuario == 'cliente'){
      tipoUsuario = 3;
    }else if(idTipoUsuario == 'empleado'){
      tipoUsuario = 2;
    }else if(idTipoUsuario == 'admin'){
      tipoUsuario = 1;
    }
    const newUser = await User.create({
        email: email,
        celular: req.body.celular,
        password: nuevaPassword,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        idTipoUsuario: tipoUsuario,
        idUsuarioPersonalizado: IdUsuarioPersonalizado,
    })
    // const newUser = new User();
    // newUser.email = email;
    // newUser.password = newUser.encryptPassword(password);
  // console.log(nuevaPassword)
    // await newUser.save();
    done(null, newUser);
  }
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findAll({
      where: {'email': email}
    });
    
  if(user == "") {
      
    return done(null, false, req.flash('signinMessage', 'No existe el Usuario'));
  }
//    return console.log(bcrypt.compareSync(password, user[0].password))
  if(!bcrypt.compareSync(password, user[0].password)) {
    return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'));
  }
//   console.log("si ne pude concectar")
  // console.log(user)
   done(null, user[0]);
}));


function windowGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
  });
}