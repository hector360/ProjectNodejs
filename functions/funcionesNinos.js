const NinosUsers = require("../database/models/NinosUser");
const NinosMembresia = require("../database/models/NinosMembresia");
var moment = require("moment");
const Membresia = require("../database/models/Membresia");
const Producto = require("../database/models/Producto");
const Beneficios = require("../database/models/Beneficios");

async function getTodosNinos(id_usuario) {
  NinosUsers.hasMany(NinosMembresia, { foreignKey: "id_nino" });
  NinosMembresia.belongsTo(NinosUsers, { foreignKey: "id_nino" });

  return await NinosUsers.findAll({
    include: [
      {
        model: NinosMembresia,
        attributes: ["id", "id_membresia", "sku_membresia"],
      },
    ],
    where: {
      id_user: id_usuario,
    },
  })
    .then((ninosUsers) => ninosUsers)
    .catch((error) => {
      console.log(error);
    });
}

async function ninoCreate(usuario_id, nombreNino) {
  return await NinosUsers.create({
    nombre: nombreNino,
    id_user: usuario_id,
    horas_globales: 0,
    status: 1,
  })
    .then((ninoUser) => ninoUser)
    .catch((error) => {
      console.log(error);
    });
}

async function ninoMembresiaCreate(data) {
  var fecha_inicio = moment().format();
  var fecha_vencimiento = moment().add(data.total_dias, "days").format();

  return await NinosMembresia.create({
    id_nino: data.id_nino,
    id_membresia: data.id_membresia,
    fecha_inicio: fecha_inicio,
    fecha_vencimiento: fecha_vencimiento,
    sku_membresia: data.sku_membresia,
    status: data.status,
  })
    .then((ninoMembresias) => ninoMembresias)
    .catch((error) => {
      console.log(error);
    });
}

async function findNinoMembresia(arrayN) {
  return await NinosMembresia.findOne({
    where: {
      sku_membresia: arrayN,
    },
  })
    .then((ninoMembresia) => ninoMembresia)
    .catch((error) => {
      console.log(error);
    });
}
async function updateNinoMembresia(id_ninoMembresia, nuevaFechaV) {
  console.log("id_ninoMembresia");
  console.log(id_ninoMembresia);
  console.log("nuevaFechaV");
  console.log(nuevaFechaV);
  return await NinosMembresia.update(
    {
      fecha_vencimiento: nuevaFechaV,
    },
    {
      where: {
        id: id_ninoMembresia,
      },
    }
  )
    .then((ninoMembresia) => ninoMembresia)
    .catch((error) => {
      console.log(error);
    });
}
async function findNinoByName(nombre) {
  return await NinosUsers.findOne({
    where: {
      nombre: nombre,
    },
  })
    .then((ninosUsers) => ninosUsers)
    .catch((error) => {
      console.log(error);
    });
}

async function findNinoById(id) {
  return await NinosUsers.findOne({
    where: {
      id: id,
    },
  })
    .then((ninosUsers) => ninosUsers)
    .catch((error) => {
      console.log(error);
    });
}

async function findNinoMembresiaById(id_nino) {
  return await NinosMembresia.findOne({
    where: {
      id_nino: id_nino,
    },
  })
    .then((ninoMembresia) => ninoMembresia)
    .catch((error) => {
      console.log(error);
    });
}
async function getMembresiasFromUser(id_user) {
  NinosUsers.hasMany(NinosMembresia, { foreignKey: "id_nino" });
  NinosMembresia.belongsTo(NinosUsers, { foreignKey: "id_nino" });

  Membresia.hasMany(NinosMembresia, { foreignKey: "id_membresia" });
  NinosMembresia.belongsTo(Membresia, { foreignKey: "id_membresia" });

  Membresia.hasMany(Beneficios, { foreignKey: "id_membresia" });
  Beneficios.belongsTo(Membresia, { foreignKey: "id_membresia" });

  Producto.hasMany(Membresia, { foreignKey: "id_producto" });
  Membresia.belongsTo(Producto, { foreignKey: "id_producto" });

  Producto;
  return await NinosUsers.findAll({
    include: [
      {
        model: NinosMembresia,
        attributes: [
          "id",
          "id_membresia",
          "fecha_inicio",
          "fecha_vencimiento",
          "sku_membresia",
        ],
        include: [
          {
            model: Membresia,
            attributes: ["id", "id_producto", "tipo_pago", "titulo"],
            include: [
              {
                model: Beneficios,
                attributes: ["beneficio"],
              },
              {
                model: Producto,
                attributes: [
                  "id",
                  "nombreProducto",
                  "urlImagenPost",
                  "slug",
                  "urlImagenMovil",
                ],
              },
            ],
          },
        ],
      },
    ],
    where: {
      id_user: id_user,
    },
  })
    .then((ninosUsers) => ninosUsers)
    .catch((error) => {
      console.log(error);
    });
}
// async function getDatosEspectaculo(slug) {
//     Espectaculos.hasMany(Cartelera, { foreignKey: "id_espectaculos" });
//     Cartelera.belongsTo(Espectaculos, { foreignKey: "id_espectaculos" });

//     Cartelera.hasMany(HorasEspectaculo, { foreignKey: "id_cartelera" });
//     HorasEspectaculo.belongsTo(Cartelera, { foreignKey: "id_cartelera" });

//     FechaCartelera.hasMany(Cartelera, { foreignKey: "idFechaCartelera" });
//     Cartelera.belongsTo(FechaCartelera, { foreignKey: "idFechaCartelera" });

//     return await Espectaculos.findOne({
//       include: [
//         {
//           model: Cartelera,
//           attributes: ["id"],
//           include: [
//             {
//               model: HorasEspectaculo,
//               attributes: ["id", "fechaHoraEntrada"],
//             },
//             {
//               model: FechaCartelera,
//               attributes: ["fechaDia"]
//             },
//           ],
//         },
//       ],
//       where: {
//         slug: slug,
//       },
//     }).then((espectaculo) => {
//       return espectaculo;
//     });
//   }

module.exports = {
  getTodosNinos,
  ninoCreate,
  ninoMembresiaCreate,
  findNinoMembresia,
  getMembresiasFromUser,
  updateNinoMembresia,
  findNinoByName,
  findNinoMembresiaById,
  findNinoById
};
