const ProductCaracteristica = require("../database/models/CaracteristicasProducto");
const boom = require("@hapi/boom");

exports.createRepository = async (data) => {
  return new Promise((resolve, reject) => {
    ProductCaracteristica.create({
      id_producto: data.id_producto,
      id_talla: data.id_talla,
      id_color: data.id_color,
      status: 1,
    }).then((pc) => {
      pc ? resolve(pc) : resolve(boom.badData(pc));
    });
  });
};

exports.get = async () => {
  return new Promise((resolve, reject) => {
    ProductCaracteristica.findAll().then((pc) => {
      pc ? resolve(pc) : resolve(boom.badData(pc));
    });
  });
};
