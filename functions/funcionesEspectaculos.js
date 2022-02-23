const Cartelera = require("../database/models/Cartelera");
const Espectaculos = require("../database/models/Espectaculos");
const HorasEspectaculo = require("../database/models/HorasEspectaculo");
const FechaCartelera = require("../database/models/FechaCartelera");
const ImagenesEspectaculos = require("../database/models/ImagenesEspectaculos");

async function getDatosEspectaculo(slug) {
  Espectaculos.hasMany(Cartelera, { foreignKey: "id_espectaculos" });
  Cartelera.belongsTo(Espectaculos, { foreignKey: "id_espectaculos" });

  Cartelera.hasMany(HorasEspectaculo, { foreignKey: "id_cartelera" });
  HorasEspectaculo.belongsTo(Cartelera, { foreignKey: "id_cartelera" });

  FechaCartelera.hasMany(Cartelera, { foreignKey: "idFechaCartelera" });
  Cartelera.belongsTo(FechaCartelera, { foreignKey: "idFechaCartelera" });

  return await Espectaculos.findOne({
    include: [
      {
        model: Cartelera,
        attributes: ["id", "status"],
        include: [
          {
            model: HorasEspectaculo,
            attributes: ["id", "fechaHoraEntrada"],
          },
          {
            model: FechaCartelera,
            attributes: ["fechaDia"]
          },
        ],
      },
    ],
    where: {
      slug: slug
    },
  }).then((espectaculo) => {
    return espectaculo;
  });
}

async function getFechasEspectaculo(id_espectaculo) {
  return await Cartelera.findAll({
    where: {
      id_espectaculos: id_espectaculo,
    },
  }).then((cartelera) => cartelera);
}

async function getAllEspectaculos(){
  return await Espectaculos.findAll({
    where: {
      status: 1
    },
    attributes: ["slug","urlImagenPost", "status"]
  })
    .then(espectaculo => espectaculo)
}
async function getImagenesEspectaculos(id_espectaculo){
  return await ImagenesEspectaculos.findAll({
    where: {
      id_espectaculos: id_espectaculo
    }
  }).then(imagenesEsp => imagenesEsp)
  .catch(error => {
    console.log(error)
  })
}
async function createImagenEspectaculos(data){
  return await ImagenesEspectaculos.create({
    id_espectaculos: data.id_espectaculos,
    imagen_espectaculo: data.imagen_espectaculo,
  }).then(imagenesEsp => imagenesEsp)
  .catch(error => {
    console.log(error)
  })
}


module.exports = {
  getDatosEspectaculo,
  getFechasEspectaculo,
  getAllEspectaculos,
  getImagenesEspectaculos,
  createImagenEspectaculos
};
