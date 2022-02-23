const bcrypt = require("bcrypt-nodejs");
const funcionesUsuarios = require("../functions/funcionesUsuarios");
const Usuarios = require("../database/models/Usuarios");
const Ticket = require("../database/models/Ticket");
const TicketEspectaculo = require("../database/models/TicketEspectaculos");
const Espectaculos = require("../database/models/Espectaculos");
const TicketCafeteria = require("../database/models/TicketCafeteriaProductos");
const TicketProducto = require("../database/models/TicketProducto");
const CafeteriaProductos = require("../database/models/CafeteriaProductos");
const Producto = require("../database/models/Producto");
const { Op } = require("sequelize");

const { sendEmail } = require("../functions/sendEmail");
const URLMAGICCRM = require("../variableGlobal/config");
const boom = require("@hapi/boom");

const URLMAGIC = URLMAGICCRM.URLMAGICCRM;

exports.getPurchasesByUserId = async (user) => {
  return new Promise((resolve, reject) => {
    Usuarios.hasMany(Ticket, { foreignKey: "usuarioId" });
    Ticket.belongsTo(Usuarios, { foreignKey: "usuarioId" });

    Usuarios.findOne({
      attributes: ["id"],
      include: [
        {
          model: Ticket,
          where: {
            estado: "liquidado",
          },
          attributes: ["idTicketSecret", "monto", "createdAt"],          
        },
      ],
      where: {
        [Op.or]: [{ id: user }, { idUsuarioPersonalizado: user }],
      },
    }).then((usuario) => {
      usuario ? resolve(usuario) : resolve(boom.badData());
    });
  });
};

exports.getUser = async ({
  nombres,
  celular,
  email,
  password,
  idTipoUsuario,
  apellidos,
  registroEntrada,
}) => {
  return new Promise(async (resolve, reject) => {
    // Creating a new User
    // let nuevaPassword = encryptPassword(password);
    var IdUsuarioPersonalizado = await windowGuid();
    var nuevaPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    var tipoUsuario;
    if (idTipoUsuario == "cliente") {
      tipoUsuario = 3;
    }

    var usuario = await funcionesUsuarios.verificarUsuarioExistente(email);

    if (usuario != null) {
      resolve(usuario);
    } else {
      const user = await Usuarios.create({
        nombres: nombres,
        apellidos: apellidos,
        celular: celular,
        email: email,
        password: nuevaPassword,
        idTipoUsuario: tipoUsuario,
        idUsuarioPersonalizado: IdUsuarioPersonalizado,
      });

      if (registroEntrada) {
        console.log("se va enviar el usuario");
        // sendEmail(req.body.data.object.metadata.email, mensaje, `Hola que tal tripulante, a continuación dejamos el link para que puedas reiniciar la contraseña de tu cuenta de Magic Planet: ${URLMAGIC}/password-reset?id=${usuario.idUsuarioPersonalizado}`);
        let mensaje = `Hola que tal tripulante, a continuación dejamos el link para que puedas reiniciar la contraseña de tu cuenta de Magic Planet: ${URLMAGIC}/password-reset?id=${user.idUsuarioPersonalizado}`;
        var correoEnviadito = sendEmail(
          user.email,
          mensaje,
          `Gracias por Registrarte ${user.nombres}`
        );
        console.log(correoEnviadito);
      }

      resolve(user);
    }
  });
};

function windowGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
