// membresiaController
const Membresia = require("../database/models/Membresia");
const Producto = require("../database/models/Producto");
const funcionesNinos = require("../functions/funcionesNinos");
const funcionesMembresia = require("../functions/funcionesMembresia");
const moment = require("moment");
const funcionesUsuarios = require("../functions/funcionesUsuarios");
const funcionesBancoHoras = require("../functions/funcionesBancoHoras");
const { isExpireSoon } = require("../repository/membershipRepository");
const {
  getStripeCheckoutSessionMembership,
} = require("../repository/stripeRepository");

exports.getMembresia = async (req, res) => {
  // await Membresia.findAll({
  //     where:{

  //     }
  // })
  // await Producto.findAll({
  //     where:{
  //         idTipoProducto: 6
  //     }
  // }).then(async producto => {
  //     // console.log(producto);
  //     // res.json(producto)

  // })
  await Producto.findOne({
    where: {
      slug: req.params.IdProducto,
    },
  })
    .then(async (producto) => {
      await Membresia.findOne({
        where: {
          id_producto: producto.id,
        },
      })
        .then(async (membresia) => {
          let arrayProducto = {
            id: producto.id,
            nombreProducto: producto.nombreProducto,
            urlImagenPost: producto.urlImagenPost,
            descripcion: producto.descripcion,
            precio: producto.precio,
            idTipoProducto: producto.idTipoProducto,
            temporada: producto.temporada,
            urlMercadoShop: producto.urlMercadoShop,
            createdAt: producto.createdAt,
            updatedAt: producto.updatedAt,
            tipo_pago: membresia.tipo_pago,
            incluye_info: membresia.incluye_info,
            terminos_condiciones: membresia.terminos_condiciones,
            shows: membresia.shows,
            horas_globales: membresia.horas_globales,
            fiesta: membresia.fiesta,
            status: membresia.status,
            prefijo: membresia.prefijo,
            slug: producto.slug,
          };

          res.json(arrayProducto);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
  // await Membresia.findOne({
  //     where: {
  //         slug: req.params.IdProducto
  //     }
  // }).then(async membresia => {
  //     // console.log(membresia)
  //     // res.json(membresia)
  //     await Producto.findOne({
  //         where:{
  //             id: req.params.IdProducto
  //         }
  //     }).then(producto => {
  //         // console.log(producto)
  //         // res.json(producto)

  //         let arrayProducto = {
  //             "id": producto.id,
  //             "nombreProducto": producto.nombreProducto,
  //             "urlImagenPost": producto.urlImagenPost,
  //             "descripcion": producto.descripcion,
  //             "precio": producto.precio,
  //             "idTipoProducto": producto.idTipoProducto,
  //             "temporada": producto.temporada,
  //             "urlMercadoShop": producto.urlMercadoShop,
  //             "createdAt": producto.createdAt,
  //             "updatedAt": producto.updatedAt,
  //             "tipo_pago": membresia.tipo_pago,
  //             "incluye_info": membresia.incluye_info,
  //             "terminos_condiciones": membresia.terminos_condiciones,
  //             "shows": membresia.shows,
  //             "horas_globales": membresia.horas_globales,
  //             "fiesta": membresia.fiesta,
  //             "status": membresia.status,
  //             "prefijo": membresia.prefijo,
  //         }

  //         res.json(arrayProducto)
  //     })
  // })
};

exports.getMembresiasFromUser = async (req, res, next) => {
  var membresias = await funcionesNinos.getMembresiasFromUser(
    req.params.IdUser
  );
  if (membresias == "") {
    var usuario = await funcionesUsuarios.getdataUsuario(req.params.IdUser);
    membresias = await funcionesNinos.getMembresiasFromUser(usuario.id);
  }
  console.log(membresias);
  var arrayMembresia = [];
  // membresias.map(async membresia => {
  //     var bancoMembresia = await funcionesBancoHoras.getBancoHoras(membresia.ninos_membresia[0].sku_membresia);
  //     console.log(bancoMembresia)
  //     arrayMembresia.push({
  //         nombre: membresia.nombre,
  //         id_user: membresia.id_user,
  //         id_nino_membresia: membresia.ninos_membresia[0].id,
  //         fecha_inicio: membresia.ninos_membresia[0].fecha_inicio,
  //         fecha_vencimiento: membresia.ninos_membresia[0].fecha_vencimiento,
  //         sku_membresia: membresia.ninos_membresia[0].sku_membresia,
  //         tipo_pago: membresia.ninos_membresia[0].membresium.tipo_pago,
  //         nombreProducto: membresia.ninos_membresia[0].membresium.producto.nombreProducto,
  //         urlImagenPost: membresia.ninos_membresia[0].membresium.producto.urlImagenPost,
  //         urlImagenMovil: membresia.ninos_membresia[0].membresium.producto.urlImagenMovil,
  //         slug: membresia.ninos_membresia[0].membresium.producto.slug,
  //     })
  // });

  for (var i = 0; i < membresias.length; i++) {
    var bancoMembresia = await funcionesBancoHoras.getBancoHoras(
      membresias[i].ninos_membresia[0].sku_membresia
    );
    console.log(bancoMembresia);
    console.log(membresias[i]);
    moment.locale("es");
    arrayMembresia.push({
      nombre: membresias[i].nombre,
      id_user: membresias[i].id_user,
      id_nino_membresia: membresias[i].ninos_membresia[0].id,
      fecha_inicio: membresias[i].ninos_membresia[0].fecha_inicio,
      fecha_vencimiento: moment(
        membresias[i].ninos_membresia[0].fecha_vencimiento
      ).format("LL"),
      expire_soon: isExpireSoon({
        expireDate: membresias[i].ninos_membresia[0].fecha_vencimiento,
      }),
      sku_membresia: membresias[i].ninos_membresia[0].sku_membresia,
      titulo: membresias[i].ninos_membresia[0].membresium.titulo,
      tipo_pago: membresias[i].ninos_membresia[0].membresium.tipo_pago,
      nombreProducto:
        membresias[i].ninos_membresia[0].membresium.producto.nombreProducto,
      urlImagenPost:
        membresias[i].ninos_membresia[0].membresium.producto.urlImagenPost,
      urlImagenMovil:
        membresias[i].ninos_membresia[0].membresium.producto.urlImagenMovil,
      slug: membresias[i].ninos_membresia[0].membresium.producto.slug,
      beneficios: membresias[i].ninos_membresia[0].membresium.benneficios.map(
        (benefit) => benefit.beneficio
      ),
      bancoMembresia: bancoMembresia,
    });
  }
  res.json(arrayMembresia);
};

exports.renewMembership = async (req, res, next) => {
  await funcionesMembresia.renewMembership(req.body.sku_membresia);
  res.json({ message: "se actualizo la fecha de vencimiento" });
};

exports.getMembershipBySku = async (req, res, next) => {
  const resp = await funcionesMembresia.findMembershipBySku(req.params.sku);

  res.json({
    status: 200,
    message: resp,
  });
};

exports.getStripeTokenMembership = async (req, res, next) => {
  const sku = req.params.sku;
  const membership = await funcionesNinos.findNinoMembresia(sku);
  const nMembership = await funcionesMembresia.findMembresia(
    membership.id_membresia
  );

  const token_stripe = await getStripeCheckoutSessionMembership({
    title: `Renovacion de ${nMembership.producto.nombreProducto} : ${sku}`,
    price: nMembership.producto.precio * 100,
    image: nMembership.producto.urlImagenMovil,
    sku,
  });

  res.json({
    message: token_stripe.id,
  });
};
