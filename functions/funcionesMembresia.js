const Membresia = require("../database/models/Membresia");
const Producto = require("../database/models/Producto");
const funcionesNinos = require("../functions/funcionesNinos");
const funcionesTicket = require("../functions/funcionesTicket");
const { isExpireSoon } = require("../repository/membershipRepository");

const moment = require("moment");
const funcionesBancoHoras = require("./funcionesBancoHoras");

async function findMembresia(id_membresia) {
  const membresia = Membresia;
  const product = Producto;

  product.hasMany(membresia, { foreignKey: "id_producto" });
  membresia.belongsTo(product, { foreignKey: "id_producto" });

  return await membresia
    .findOne({
      include: [
        {
          model: product,
        },
      ],
      where: {
        id: id_membresia,
      },
    })
    .then((membresia) => membresia)
    .catch((error) => {
      console.log(error);
    });
}

async function findMembershipBySku(sku) {
  var ninosMembresias = await funcionesNinos.findNinoMembresia(sku);
  var membresia = await findMembresia(ninosMembresias.id_membresia);
  var nino = await funcionesNinos.findNinoById(ninosMembresias.id_nino);

  return {
    name: nino.nombre,
    sku: ninosMembresias.sku_membresia,
    title: membresia.titulo,
    membreship: {
      slug: membresia.producto.slug,
      name: membresia.producto.nombreProducto,
      url_image: `https://crm.magicplanet.club/${membresia.producto.urlImagenPost}`,
      isExpire: isExpireSoon(ninosMembresias.fecha_vencimiento)
    },
  };
}

async function renewMembership(sku) {
  console.log(sku);
  var ninosMembresias = await funcionesNinos.findNinoMembresia(sku);
  console.log(ninosMembresias);
  var membresia = await findMembresia(ninosMembresias.id_membresia);

  var nino = await funcionesNinos.findNinoById(ninosMembresias.id_nino);

  console.log(membresia.total_dias);
  var nuevaFechaV = moment(ninosMembresias.fecha_vencimiento)
    .add(membresia.total_dias, "days")
    .format();
  console.log("nuevaFechaV");
  console.log(nuevaFechaV);

  var idTicketSecret = await windowGuid2();
  var fecha = new Date();
  var year = fecha.getFullYear();
  idTicketSecret = `tp-${year}` + idTicketSecret;

  const ticket = await funcionesTicket.createTicket({
    customerTicketId: windowGuid2(),
    usuarioId: nino.id_user,
    statusTicket: "NoReclamado",
    monto: membresia.producto.precio,
    faltante: 0,
    estado: "liquidado",
    idTicketSecret,
  });

  const ticketProducto = await funcionesTicket.createTicketProducto({
    id_ticket: ticket.id,
    id_producto: membresia.producto.id,
    cantidad: 1,
    precio_unitario: membresia.producto.precio,
    idTicketProdSecret: windowGuid2(),
    idTalla: 0,
    idColor: 0,
  });
  // console.log(moment(ninosMembresias.fecha_vencimiento).format())
  await funcionesNinos.updateNinoMembresia(ninosMembresias.id, nuevaFechaV);
  var bancoHora = await funcionesBancoHoras.getBancoHoras(sku);
  var horas_suma =
    parseInt(membresia.horas_globales) + parseInt(bancoHora.horas_restantes);
  await funcionesBancoHoras.renovarMembresia(horas_suma, sku, ticket.id);
}

function windowGuid2() {
  return "xxxxx-xx4x-yxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

module.exports = {
  findMembresia,
  renewMembership,
  findMembershipBySku,
};
